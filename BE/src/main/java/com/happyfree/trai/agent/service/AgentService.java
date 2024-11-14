package com.happyfree.trai.agent.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.happyfree.trai.agent.dto.AgentDecisionResult;
import com.happyfree.trai.agent.entity.Agent;
import com.happyfree.trai.agent.dto.AssetData;
import com.happyfree.trai.agent.repository.AgentRepository;
import com.happyfree.trai.global.exception.CustomException;
import com.happyfree.trai.profitAsset.dto.RecentInvestmentSummary;
import com.happyfree.trai.profitAsset.entity.ProfitAssetHistory;
import com.happyfree.trai.profitAsset.repository.ProfitAssetRepository;
import com.happyfree.trai.transactionHistory.dto.RecentTransactionHistory;
import com.happyfree.trai.transactionHistory.entity.TransactionHistory;
import com.happyfree.trai.transactionHistory.repository.TransactionHistoryRepository;
import com.happyfree.trai.profitAsset.service.ProfitAssetService;
import com.happyfree.trai.user.entity.User;
import com.happyfree.trai.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static com.happyfree.trai.global.exception.ErrorCode.*;


@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AgentService {

    private final ProfitAssetService profitAssetService;

    private final UserRepository userRepository;

    private final AgentRepository agentRepository;

    private final TransactionHistoryRepository transactionHistoryRepository;

    private final WebClient webClient;

    private final ObjectMapper mapper = new ObjectMapper();

    private final ProfitAssetRepository profitAssetRepository;

    String serverUrl = "https://api.upbit.com";

    @Transactional(readOnly = true)
    public AgentDecisionResult findAgentHistoryById(long agentId) {
        Agent agentDecision = agentRepository.findById(agentId)
                .orElseThrow(() -> new CustomException(AGENT_NOT_FOUND));

        return AgentDecisionResult.builder()
                .jsonData(agentDecision.getJsonData())
                .createdAt(agentDecision.getCreatedAt())
                .build();
    }

    @Transactional
    public void sendAssetsDataToAgent() {
        List<User> allAdminUser = userRepository.findByRole("ROLE_ADMIN");

        allAdminUser.forEach(user -> {
            try {
                String accessKey = user.getAccessKey();
                String secretKey = user.getSecretKey();
                // 데이터 수집
                BigDecimal totalBTCAmount = profitAssetService.getBitcoinAmount(accessKey, secretKey);
                BigDecimal tradePrice = profitAssetService.getBitcoinCurrentPrice();
                BigDecimal totalKRWAssets = profitAssetService.getTotalKRW(accessKey, secretKey);

                List<ProfitAssetHistory> profitAssetHistories = profitAssetRepository
                        .findTop5ByUserAndSettlementDateLessThanOrderBySettlementDateDesc(user, LocalDate.now());
                List<RecentInvestmentSummary> investmentPerformanceSummary = profitAssetHistories.stream()
                        .map(RecentInvestmentSummary::from)
                        .collect(Collectors.toList());

                List<TransactionHistory> transactionHistories = transactionHistoryRepository
                        .findTop10ByUserOrderByCreatedAtDesc(user);
                List<RecentTransactionHistory> bitcoinPositionHistory = transactionHistories.stream()
                        .map(RecentTransactionHistory::from)
                        .collect(Collectors.toList());

                // 단일 AssetData 객체 생성
                AssetData assetData = AssetData.builder()
                        .userId(user.getId())
                        .btcBalanceKrw(totalBTCAmount.multiply(tradePrice).floatValue())
                        .availableAmount(totalKRWAssets.floatValue())
                        .investmentType(user.getInvestmentType() != null ? user.getInvestmentType() : "None")
                        .investmentPerformanceSummary(investmentPerformanceSummary)
                        .bitcoinPositionHistory(bitcoinPositionHistory)
                        .build();

                // AI 서버로 단일 요청 전송
                webClient
                        .post()
                        .uri("http://3.35.238.247:8000/ai/analysis")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(assetData)
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .subscribe(
                                result -> {
                                    try {
                                        processAnalysisResult(result, assetData);
                                    } catch (Exception e) {
                                        throw new CustomException(AI_PROCESS_ERROR);
                                    }
                                },
                                error -> {
                                    log.error("AI Server Error: {}", error.getMessage());
                                }
                        );

            } catch (Exception e) {
                throw new CustomException(ASSET_DATA_ERROR);
            }
        });
    }

    private void processAnalysisResult(JsonNode result, AssetData assetData) {
        try {
            // 매수, 매도 결정과 투자 퍼센트 추출
            String decision = result.path("decision_maker").path("decision").asText();
            int percentage = result.path("decision_maker").path("percentage").asInt();
            long userId = result.path("user_info").path("user_id").asLong();

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new CustomException(USER_NOT_FOUND));

            String accessKey = user.getAccessKey();
            String secretKey = user.getSecretKey();
            BigDecimal nowBitcoinPrice = profitAssetService.getBitcoinCurrentPrice();

            log.info("decision : {}", decision);
            log.info("percentage : {}", percentage);

            // 매수, 매도 주문 처리
            boolean enoughAmount = true;
            if (decision.equals("BUY")) {
                BigDecimal orderAmount =  BigDecimal.valueOf(assetData.getAvailableAmount())
                        .multiply(BigDecimal.valueOf(percentage))
                        .divide(BigDecimal.valueOf(100), 0, RoundingMode.DOWN);

                enoughAmount =  checkAmount(orderAmount);

                if (enoughAmount) {
                    order("bid", orderAmount.toString(), accessKey, secretKey);
                }
            } else if (decision.equals("SELL")) {
                BigDecimal totalBTCAmount = profitAssetService.getBitcoinAmount(accessKey, secretKey);
                BigDecimal orderAmount = totalBTCAmount
                        .multiply(BigDecimal.valueOf(percentage))
                        .divide(BigDecimal.valueOf(100), 8, RoundingMode.DOWN);

                enoughAmount = checkAmount(orderAmount.multiply(nowBitcoinPrice));

                if (enoughAmount) {
                    order("ask", orderAmount.toString(), accessKey, secretKey);
                }
            }

            // 분석 결과 저장
            Agent agent = Agent.builder()
                    .jsonData(mapper.writeValueAsString(result))
                    .build();
            agentRepository.save(agent);

            BigDecimal nowBitcoinCount = profitAssetService.getBitcoinAmount(accessKey, secretKey);
            BigDecimal averageBitcoinPrice = profitAssetService.getBTCAveragePrice(accessKey, secretKey);

            // 투자 내역 저장
            if (enoughAmount && (decision.equals("SELL") || decision.equals("BUY"))) {
                TransactionHistory transactionHistory = searchInvestmentHistory(accessKey, secretKey);
                if (transactionHistory != null) {
                    transactionHistory.updateUser(user);
                    transactionHistory.updateSide(decision);
                    transactionHistory.updateTotalEvaluation(BigDecimal.valueOf(Long.parseLong(transactionHistory.getPrice())).multiply(nowBitcoinCount));
                    transactionHistory.updateTotalAmount(profitAssetService.getTotalKRW(accessKey, secretKey)
                            .add(nowBitcoinPrice.multiply(nowBitcoinCount)));
                    transactionHistory.updateAveragePrice(averageBitcoinPrice);
                    transactionHistory.updateAgent(agent);

                    if (decision.equals("SELL")) {
                        BigDecimal profitAndLoss = new BigDecimal(transactionHistory.getPrice())
                                .subtract(averageBitcoinPrice)
                                .multiply(new BigDecimal(transactionHistory.getExecutedVolume()))
                                .subtract(new BigDecimal(transactionHistory.getPaidFee()).multiply(new BigDecimal("2")));

                        transactionHistory.updateProfitAndLoss(profitAndLoss);
                    }

                    transactionHistoryRepository.save(transactionHistory);
                }
            } else {
                if (!enoughAmount) {
                    decision = "HOLD";
                }

                TransactionHistory transactionHistory = TransactionHistory.builder()
                        .user(user)
                        .agent(agent)
                        .side(decision)
                        .totalEvaluation(nowBitcoinPrice.multiply(nowBitcoinCount))
                        .totalAmount(profitAssetService.getTotalKRW(accessKey, secretKey)
                                .add(nowBitcoinPrice.multiply(nowBitcoinCount)))
                        .executedFunds(BigDecimal.ZERO)
                        .orderCreatedAt(LocalDateTime.now())
                        .averagePrice(averageBitcoinPrice)
                        .price(nowBitcoinPrice.toString())
                        .profitAndLoss(BigDecimal.ZERO)
                        .build();

                transactionHistoryRepository.save(transactionHistory);
            }

            log.info("업비트 Agent 처리 완료");
        } catch (Exception e) {
            throw new CustomException(AI_PROCESS_ERROR);
        }
    }

    // 업비트 주문하기
    public void order(String orderType, String amount, String accessKey, String secretKey) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        HashMap<String, String> params = new HashMap<>();
        params.put("market", "KRW-BTC");
        params.put("side", orderType);
        if (orderType.equals("bid")) {
            params.put("ord_type", "price");
            params.put("price", amount);
        } else {
            params.put("ord_type", "market");
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

            log.info(EntityUtils.toString(entity, "UTF-8"));
        } catch (Exception e) {
            throw new CustomException(ORDER_ERROR);
        }
    }
 
    // 업비트 거래내역 검색 
    public TransactionHistory searchInvestmentHistory(String accessKey, String secretKey) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        HashMap<String, String> params = new HashMap<>();
        params.put("market", "KRW-BTC");
        params.put("limit", "1");
        params.put("order_by", "desc");
        String[] states = {
                "done",
                "cancel"
        };

        ArrayList<String> queryElements = new ArrayList<>();
        for(Map.Entry<String, String> entity : params.entrySet()) {
            queryElements.add(entity.getKey() + "=" + entity.getValue());
        }
        for(String state : states) {
            queryElements.add("states[]=" + state);
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
            String jsonResponse = EntityUtils.toString(response.getEntity(), "UTF-8");
            JsonNode jsonArray = mapper.readTree(jsonResponse);

            if (jsonArray.isArray() && !jsonArray.isEmpty()) {
                JsonNode jsonObject = jsonArray.get(0);
                log.info("주문 조회: {}", jsonObject.toString());

                BigDecimal executedFunds = new BigDecimal(jsonObject.get("executed_funds").asText());
                BigDecimal executedVolume = new BigDecimal(jsonObject.get("executed_volume").asText());

                return TransactionHistory.builder()
                        .uuid(jsonObject.get("uuid").asText())
                        .orderType(jsonObject.get("ord_type").asText())
                        .state(jsonObject.get("state").asText())
                        .market(jsonObject.get("market").asText())
                        .paidFee(jsonObject.get("paid_fee").asText())
                        .executedVolume(jsonObject.get("executed_volume").asText())
                        .executedFunds(new BigDecimal(jsonObject.get("executed_funds").asText()))
                        .tradesCount(jsonObject.get("trades_count").asInt())
                        .price(String.valueOf(executedFunds.divide(executedVolume, 0, RoundingMode.HALF_UP)))
                        .orderCreatedAt(LocalDateTime.parse(jsonObject.get("created_at").asText().replace("+09:00", "")))
                        .build();
            }

        } catch (Exception e) {
            throw new CustomException(SEARCH_INVESTMENT_ERROR);
        }

        return null;
    }

    private boolean checkAmount(BigDecimal orderAmount){
        if (orderAmount.compareTo(new BigDecimal("6000")) <= 0) {
            log.info("주문 금액이 6000원 이하입니다: {}", orderAmount);
            return false;
        }
        return true;
    }

}
