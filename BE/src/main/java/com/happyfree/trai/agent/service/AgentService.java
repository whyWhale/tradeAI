package com.happyfree.trai.agent.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.happyfree.trai.agent.entity.AnalysisResult;
import com.happyfree.trai.agent.dto.AssetData;
import com.happyfree.trai.agent.repository.AnalysisResultRepository;
import com.happyfree.trai.global.exception.CustomException;
import com.happyfree.trai.investment.entity.InvestmentHistory;
import com.happyfree.trai.investment.repository.InvestmentHistoryRepository;
import com.happyfree.trai.profitasset.service.ProfitAssetService;
import com.happyfree.trai.user.entity.User;
import com.happyfree.trai.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

import static com.happyfree.trai.global.exception.ErrorCode.*;

@Service
@Transactional
@RequiredArgsConstructor
public class AgentService {

    private final ProfitAssetService profitAssetService;

    private final UserRepository userRepository;

    private final AnalysisResultRepository analysisResultRepository;

    private final InvestmentHistoryRepository investmentHistoryRepository;

    private final WebClient webClient;

    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${upbit.api.accesskey}")
    private String accessKey;

    @Value("${upbit.api.secretkey}")
    private String secretKey;

    String serverUrl = "https://api.upbit.com";

    @Transactional
    public void sendAssetsDataToAgent() {
        List<User> allAdminUser = userRepository.findByRole("ROLE_ADMIN");

        // 모든 사용자의 자산 데이터를 수집
        List<AssetData> allAssetData = allAdminUser.stream()
                .map(user -> {
                    try {
                        BigDecimal totalBTCAmount = profitAssetService.bcv();
                        BigDecimal tradePrice = profitAssetService.bitp();
                        BigDecimal totalKRWAssets = profitAssetService.getTotalKRWAssets(accessKey, secretKey);

                        return AssetData.builder()
                                .userId(user.getId())
                                .totalCoinEvaluation(totalBTCAmount.multiply(tradePrice))
                                .totalKRWAssets(totalKRWAssets)
                                .build();
                    } catch (Exception e) {
                        throw new CustomException(ASSET_DATA_ERROR);
                    }
                })
                .toList();

        AtomicInteger index = new AtomicInteger(0);

        webClient
                .post()
                .uri("http://3.35.238.247:8000/ai/analysis")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(allAssetData)
                .retrieve()
                .bodyToFlux(AnalysisResult.class)  // 스트리밍 방식으로 결과를 받음
                .subscribe(result -> {
                    try {
                        System.out.println("Result 객체: " + result);
                        System.out.println("jsonData: " + result.getJsonData());
                        System.out.println("jsonData type: " + (result.getJsonData() != null ? result.getJsonData().getClass().getName() : "null"));
                        System.out.println("===========================");
                        // index를 기반으로 해당하는 User와 AssetData 찾기
                        int currentIndex = index.getAndIncrement();
                        User user = allAdminUser.get(currentIndex);
                        AssetData assetData = allAssetData.get(currentIndex);
                        // 결과 처리
                        processAnalysisResult(user, result, assetData);
                    } catch (Exception e) {
                        throw new CustomException(AI_PROCESS_ERROR);
                    }
                }, error -> {
                    // onError 콜백 추가하여 예외 처리
                    System.err.println("에러 발생: " + error.getMessage());
                    error.printStackTrace();
                });
    }

    private void processAnalysisResult(User user, AnalysisResult result, AssetData assetData) {
        try {
            // 매수, 매도 결정과 투자 퍼센트 추출
            JsonNode rootNode = mapper.readTree(result.getJsonData());
            String decision = rootNode.path("master").path("decision").asText();
            int percentage = rootNode.path("master").path("percentage").asInt();
            // 매수, 매도 주문 처리
            if (decision.equals("BUY")) {
                BigDecimal orderAmount = assetData.getTotalKRWAssets()
                        .multiply(BigDecimal.valueOf(percentage))
                        .divide(BigDecimal.valueOf(100), 0, RoundingMode.DOWN);
                order("bid", orderAmount.toString());
            } else if (decision.equals("SELL")) {
                BigDecimal totalBTCAmount = profitAssetService.bcv();
                BigDecimal orderAmount = totalBTCAmount
                        .multiply(BigDecimal.valueOf(percentage))
                        .divide(BigDecimal.valueOf(100), 8, RoundingMode.DOWN);
                order("ask", orderAmount.toString());
            }
            // 분석 결과 저장
            result.updateUser(user);
            analysisResultRepository.save(result);

            // 투자 내역 저장
            InvestmentHistory investmentHistory = searchInvestmentHistory();
            if (investmentHistory != null) {
                investmentHistory.updateUser(user);
                investmentHistory.updateTotalEvaluation(
                        profitAssetService.bitp().multiply(profitAssetService.bcv())
                );
                investmentHistory.updateTotalAmount(
                        profitAssetService.getTotalKRWAssets(accessKey, secretKey)
                );
                investmentHistoryRepository.save(investmentHistory);
            }
        } catch (Exception e) {
            throw new CustomException(AI_PROCESS_ERROR);
        }
    }

    // 업비트 주문하기
    public void order(String orderType, String amount) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        HashMap<String, String> params = new HashMap<>();

        params.put("market", "KRW-BTC");
        params.put("ord_type", "limit");
        params.put("side", orderType);
        if (orderType.equals("bid")) {
            params.put("price", amount);
        } else {
            params.put("volume", amount);
        }

        ArrayList<String> queryElements = new ArrayList<>();
        for(Map.Entry<String, String> entity : params.entrySet()) {
            queryElements.add(entity.getKey() + "=" + entity.getValue());
        }

        String queryString = String.join("&", queryElements.toArray(new String[0]));

        MessageDigest md = MessageDigest.getInstance("SHA-512");
        md.update(queryString.getBytes("UTF-8"));

        String queryHash = String.format("%0128x", new BigInteger(1, md.digest()));

        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        String jwtToken = JWT.create()
                .withClaim("access_key", accessKey)
                .withClaim("nonce", UUID.randomUUID().toString())
                .withClaim("query_hash", queryHash)
                .withClaim("query_hash_alg", "SHA512")
                .sign(algorithm);

        String authenticationToken = "Bearer " + jwtToken;

        try {
            HttpClient client = HttpClientBuilder.create().build();
            HttpPost request = new HttpPost(serverUrl + "/v1/orders");
            request.setHeader("Content-Type", "application/json");
            request.addHeader("Authorization", authenticationToken);
            request.setEntity(new StringEntity(new Gson().toJson(params)));

            HttpResponse response = client.execute(request);
            HttpEntity entity = response.getEntity();

            System.out.println(EntityUtils.toString(entity, "UTF-8"));
        } catch (Exception e) {
            throw new CustomException(ORDER_ERROR);
        }
    }
 
    // 업비트 거래내역 검색 
    public InvestmentHistory searchInvestmentHistory() throws NoSuchAlgorithmException, UnsupportedEncodingException {
        HashMap<String, String> params = new HashMap<>();
        params.put("market", "KRW-BTC");
        params.put("state", "done");
        params.put("limit", "1");
        params.put("order_by", "desc");

        ArrayList<String> queryElements = new ArrayList<>();
        for(Map.Entry<String, String> entity : params.entrySet()) {
            queryElements.add(entity.getKey() + "=" + entity.getValue());
        }

        String queryString = String.join("&", queryElements.toArray(new String[0]));

        MessageDigest md = MessageDigest.getInstance("SHA-512");
        md.update(queryString.getBytes("UTF-8"));

        String queryHash = String.format("%0128x", new BigInteger(1, md.digest()));

        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        String jwtToken = JWT.create()
                .withClaim("access_key", accessKey)
                .withClaim("nonce", UUID.randomUUID().toString())
                .withClaim("query_hash", queryHash)
                .withClaim("query_hash_alg", "SHA512")
                .sign(algorithm);

        String authenticationToken = "Bearer " + jwtToken;

        try {
            HttpClient client = HttpClientBuilder.create().build();
            HttpGet request = new HttpGet(serverUrl + "/v1/orders/closed?" + queryString);
            request.setHeader("Content-Type", "application/json");
            request.addHeader("Authorization", authenticationToken);

            HttpResponse response = client.execute(request);
            HttpEntity entity = response.getEntity();
            String jsonResponse = EntityUtils.toString(response.getEntity(), "UTF-8");

            System.out.println(EntityUtils.toString(entity, "UTF-8"));

            JsonNode jsonArray = mapper.readTree(jsonResponse);

            if (jsonArray.isArray() && !jsonArray.isEmpty()) {
                JsonNode jsonObject = jsonArray.get(0);

                return InvestmentHistory.builder()
                        .uuid(jsonObject.get("uuid").asText())
                        .side(jsonObject.get("side").asText())
                        .orderType(jsonObject.get("ord_type").asText())
                        .price(jsonObject.get("price").asText())
                        .state(jsonObject.get("state").asText())
                        .market(jsonObject.get("market").asText())
                        .volume(jsonObject.get("volume").asText())
                        .reservedFee(jsonObject.get("reserved_fee").asText())
                        .executedVolume(jsonObject.get("executed_volume").asText())
                        .executedFunds(new BigDecimal(jsonObject.get("executed_funds").asText()))
                        .averagePrice(new BigDecimal(jsonObject.get("average_price").asText()))
                        .tradesCount(jsonObject.get("trades_count").asInt())
                        .orderCreatedAt(LocalDateTime.parse(jsonObject.get("created_at").asText()))
                        .build();
            }

        } catch (Exception e) {
            throw new CustomException(SEARCH_INVESTMENT_ERROR);
        }

        return null;
    }
}
