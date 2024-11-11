package com.happyfree.trai.profitAsset.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.happyfree.trai.auth.service.AuthService;
import com.happyfree.trai.profitAsset.dto.AssetProportion;
import com.happyfree.trai.profitAsset.dto.TransactionSummary;
import com.happyfree.trai.profitAsset.entity.ProfitAssetHistory;
import com.happyfree.trai.profitAsset.repository.ProfitAssetRepository;
import com.happyfree.trai.transactionHistory.entity.TransactionHistory;
import com.happyfree.trai.transactionHistory.repository.TransactionHistoryRepository;
import com.happyfree.trai.user.entity.User;
import com.happyfree.trai.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class ProfitAssetService {

    private final ProfitAssetRepository profitAssetRepository;

    private final TransactionHistoryRepository transactionHistoryRepository;

    private final UserRepository userRepository;

    private final AuthService authService;

    String serverUrl = "https://api.upbit.com";

    public TransactionSummary getTotalProfit() throws JsonProcessingException, UnsupportedEncodingException, NoSuchAlgorithmException {
        User loginUser = authService.getLoginUser();
        Optional<ProfitAssetHistory> pah = profitAssetRepository.findByUserAndSettlementDate(loginUser,
                LocalDate.now().minusDays(1));
        BigDecimal ia = BigDecimal.ZERO;
        BigDecimal yp = BigDecimal.ZERO;
        if (pah.isPresent()) {
            yp = pah.get().getAccumulationProfitRatio();
            ia = pah.get().getStartingAssets();
        }
        BigDecimal todayProfitRatio = getTodayProfit(loginUser.getAccessKey(), loginUser.getSecretKey(), ia);
        BigDecimal profit = yp.add(BigDecimal.ONE)
                .multiply(BigDecimal.ONE.add(todayProfitRatio.divide(BigDecimal.valueOf(100))))
                .subtract(BigDecimal.ONE);
        List<TransactionHistory> list = transactionHistoryRepository.findByUserOrderByCreatedAtDesc(
                authService.getLoginUser());
        int bid = 0, hold = 0, ask = 0;
        for (int i = 0; i < list.size(); i++) {
            TransactionHistory ih = list.get(i);
            String side = ih.getSide();
            if (side.equals("bid")) {
                bid++;
            } else if (side.equals("ask")) {
                ask++;
            } else {
                hold++;
            }
        }

        return TransactionSummary.builder()
                .totalTransactionCount(list.size())
                .firstTransactionTime(list.get(0).getOrderCreatedAt())
                .lastTransactionTime(list.get(list.size() - 1).getOrderCreatedAt())
                .bid(bid)
                .ask(ask)
                .hold(hold)
                .profit(profit)
                .build();
    }

    private BigDecimal getTodayProfit(String accessKey, String secretKey, BigDecimal initialAsset) throws
            NoSuchAlgorithmException,
            UnsupportedEncodingException,
            JsonProcessingException {
        BigDecimal with = getTotalWithdraws(accessKey, secretKey, LocalDate.now());
        BigDecimal de = getTotalDeposit(accessKey, secretKey, LocalDate.now());
        BigDecimal bcv = getBitcoinAmount(accessKey, secretKey);
        BigDecimal m = getTotalMoney(accessKey, secretKey);
        BigDecimal cBp = getBitcoinCurrentPrice();
        BigDecimal tbv = bcv.multiply(cBp);
        return bcv.multiply(cBp)
                .add(m)
                .subtract(initialAsset)
                .add(with)
                .subtract(de)
                .divide(initialAsset.add(de), 2, RoundingMode.DOWN)
                .multiply(new BigDecimal("100"));
    }

    // 해당 날짜의 전체 출금액
    public BigDecimal getTotalWithdraws(String accessKey, String secretKey, LocalDate today) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        HashMap<String, String> params = new HashMap<>();
        params.put("currency", "XRP");

        String[] txids = {
        };

        ArrayList<String> queryElements = new ArrayList<>();
        for (Map.Entry<String, String> entity : params.entrySet()) {
            queryElements.add(entity.getKey() + "=" + entity.getValue());
        }
        for (String txid : txids) {
            queryElements.add("txids[]=" + txid);
        }

        String queryString = String.join("&", queryElements.toArray(new String[0]) + "&state=done");

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
        RestTemplate restTemplate = null;
        String body = null;
        try {
            restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authenticationToken);
            headers.set("Content-Type", "application/json");
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    serverUrl + "/v1/withdraw?" + queryString,
                    HttpMethod.GET,
                    entity,
                    String.class
            );
            body = response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
        }

        String response = body;
        BigDecimal totalWithdrawal = BigDecimal.ZERO;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode withdrawals = mapper.readTree(response);

            for (JsonNode withdrawal : withdrawals) {
                if (withdrawal.get("done_at") == null) {
                    continue;
                }
                String doneAt = withdrawal.get("done_at").asText().substring(0, 10);
                if (doneAt.equals(today.format(formatter))) {
                    BigDecimal amount = new BigDecimal(withdrawal.get("amount").asText());
                    totalWithdrawal = totalWithdrawal.add(amount);
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        return totalWithdrawal;
    }

    // 현재 비트코인 시세
    public BigDecimal getBitcoinCurrentPrice() throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> bit = restTemplate.exchange(
                serverUrl + "/v1/ticker?markets=KRW-BTC",
                HttpMethod.GET,
                entity,
                String.class
        );
        ObjectMapper mapper = new ObjectMapper();
        JsonNode jsonArray = mapper.readTree(bit.getBody());
        Double tradePrice = jsonArray.get(0).get("trade_price").asDouble();
        if (tradePrice == null) {
            tradePrice = 0.0;
        }
        return new BigDecimal(tradePrice);
    }

    // 비트코인 개수
    public BigDecimal getBitcoinAmount(String accessKey, String secretKey) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        String jwtToken = JWT.create()
                .withClaim("access_key", accessKey)
                .withClaim("nonce", UUID.randomUUID().toString())
                .sign(algorithm);
        String authenticationToken = "Bearer " + jwtToken;
        headers.set("Authorization", authenticationToken);
        headers.set("Content-Type", "application/json");
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                serverUrl + "/v1/accounts",
                HttpMethod.GET,
                entity,
                String.class
        );
        ObjectMapper mapper = new ObjectMapper();
        JsonNode jsonArray = mapper.readTree(response.getBody());
        for (JsonNode node : jsonArray) {
            String currency = node.get("currency").asText();
            if ("BTC".equals(currency)) {
                Double balance = node.get("balance").asDouble();
                return new BigDecimal(balance);
            }
        }

        return BigDecimal.ZERO;
    }

    // 해당 날짜의 전체 입금액
    public BigDecimal getTotalDeposit(String accessKey, String secretKey, LocalDate today) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        HashMap<String, String> params = new HashMap<>();
        params.put("currency", "KRW");

        String[] txids = {
        };

        ArrayList<String> queryElements = new ArrayList<>();
        for (Map.Entry<String, String> entity : params.entrySet()) {
            queryElements.add(entity.getKey() + "=" + entity.getValue());
        }
        for (String txid : txids) {
            queryElements.add("txids[]=" + txid);
        }

        queryElements.add("state=ACCEPTED");

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
        RestTemplate restTemplate = null;
        String body = null;
        try {
            restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authenticationToken);
            headers.set("Content-Type", "application/json");
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    serverUrl + "/v1/deposits?" + queryString,
                    HttpMethod.GET,
                    entity,
                    String.class
            );
            body = response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
        }

        String response = body;
        BigDecimal totalWithdrawal = BigDecimal.ZERO;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode withdrawals = mapper.readTree(response);

            for (JsonNode withdrawal : withdrawals) {
                if (withdrawal.get("done_at") == null) {
                    continue;
                }
                String doneAt = withdrawal.get("done_at").asText().substring(0, 10);
                if (doneAt.equals(today.format(formatter))) {
                    BigDecimal amount = new BigDecimal(withdrawal.get("amount").asText());
                    totalWithdrawal = totalWithdrawal.add(amount);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return totalWithdrawal;
    }

    // 총 보유액(현금 balance + lock)
    public BigDecimal getTotalMoney(String accessKey, String secretKey) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        String jwtToken = JWT.create()
                .withClaim("access_key", accessKey)
                .withClaim("nonce", UUID.randomUUID().toString())
                .sign(algorithm);
        String authenticationToken = "Bearer " + jwtToken;
        headers.set("Authorization", authenticationToken);
        headers.set("Content-Type", "application/json");
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                serverUrl + "/v1/accounts",
                HttpMethod.GET,
                entity,
                String.class
        );

        ObjectMapper mapper = new ObjectMapper();
        JsonNode jsonArray = mapper.readTree(response.getBody());

        for (JsonNode node : jsonArray) {
            String currency = node.get("currency").asText();
            if ("KRW".equals(currency)) {
                Double amount = node.get("balance").asDouble() + node.get("locked").asDouble();
                return new BigDecimal(amount);
            }
        }

        return BigDecimal.ZERO;
    }

    public Page<ProfitAssetHistory> detail(Pageable page) {
        User loginUser = authService.getLoginUser();
        LocalDateTime today =  LocalDate.now().atStartOfDay();
        return profitAssetRepository.findByUserAndCreatedAtBeforeOrderByCreatedAtDesc(loginUser, page, today);
    }

    public List<AssetProportion> assetProportion() {
        User loginUser = authService.getLoginUser();
        List<ProfitAssetHistory> all = profitAssetRepository.findByUser(loginUser);
        List<AssetProportion> list = new ArrayList<>();
        int count = 30;
        for (ProfitAssetHistory profitAssetHistory : all) {
            list.add(AssetProportion.builder().coinPercentage(profitAssetHistory.getCoinAssetPercentage()).createdAt(profitAssetHistory.getSettlementDate()).build());
            count--;
            if (count == 0) {
                break;
            }
        }
        return list;

    }

    @Transactional
    public void saveDailyProfitAssetHistory() throws JsonProcessingException, UnsupportedEncodingException, NoSuchAlgorithmException {
        List<User> allAdminUser = userRepository.findByRole("ROLE_ADMIN");
        for (User user : allAdminUser) {
            String accessKey = user.getAccessKey();
            String secretKey = user.getSecretKey();

            LocalDate today = LocalDate.now();
            LocalDate yesterday = today.minusDays(1);
            LocalDate twoDaysAgo = today.minusDays(2);

            // 이틀 전 누적 수익률, 누적 손익 가져오기
            BigDecimal beforeAccumulationProfitRatio = BigDecimal.ZERO;
            BigDecimal beforeAccumulationProfitAndLoss = BigDecimal.ZERO;

            Optional<ProfitAssetHistory> twoDaysAgoProfitAssetHistory = profitAssetRepository.findByUserAndSettlementDate(user, twoDaysAgo);
            if (twoDaysAgoProfitAssetHistory.isPresent()) {
                beforeAccumulationProfitRatio = twoDaysAgoProfitAssetHistory.get().getAccumulationProfitRatio();
                beforeAccumulationProfitAndLoss = twoDaysAgoProfitAssetHistory.get().getAccumulationProfitAndLoss();
            }

            // 기초자산
            BigDecimal startingAssets = BigDecimal.ZERO;
            Optional<ProfitAssetHistory> yesterdayProfitAssetHistory = profitAssetRepository.findByUserAndSettlementDate(user, yesterday);
            if (yesterdayProfitAssetHistory.isPresent()) {
                startingAssets = yesterdayProfitAssetHistory.get().getStartingAssets();
            }

            // 현재 총 코인 평가금액 계산
            BigDecimal totalCoinEvaluation = getBitcoinCurrentPrice().multiply(getBitcoinAmount(accessKey, secretKey));

            // 현재 총 원화 자산
            BigDecimal totalKRWAssets = getTotalMoney(accessKey, secretKey);

            // 기말자산
            BigDecimal endingAssets = totalCoinEvaluation
                    .add(totalKRWAssets);

            // 전 날 전체 입금액
            BigDecimal totalDepositAmount = getTotalDeposit(accessKey, secretKey, yesterday);

            // 전 날 전체 출금액
            BigDecimal totalWithdrawAmount = getTotalWithdraws(accessKey, secretKey, yesterday);

            // 일일 손익
            BigDecimal dailyProfitAndLoss = endingAssets
                    .subtract(startingAssets)
                    .add(totalWithdrawAmount)
                    .subtract(totalDepositAmount);

            // 누적 손익
            BigDecimal accumulationProfitAndLoss = beforeAccumulationProfitAndLoss
                    .add(dailyProfitAndLoss);

            // 일일 수익률
            BigDecimal dailyProfitRatio = BigDecimal.ZERO;
            if (startingAssets.add(totalDepositAmount).compareTo(BigDecimal.ZERO) > 0) {
                dailyProfitRatio = dailyProfitAndLoss
                        .divide(startingAssets.add(totalDepositAmount), 8, RoundingMode.DOWN)
                        .multiply(BigDecimal.valueOf(100))
                        .setScale(2, RoundingMode.DOWN);
            }

            // 누적 수익률
            BigDecimal accumulationProfitRatio = beforeAccumulationProfitRatio
                    .divide(BigDecimal.valueOf(100), 8, RoundingMode.DOWN)
                    .add(BigDecimal.ONE)
                    .multiply(BigDecimal.ONE.add(dailyProfitRatio.divide(BigDecimal.valueOf(100), 8, RoundingMode.DOWN)))
                    .subtract(BigDecimal.ONE)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.DOWN);

            log.info("일일 수익률 : {}", dailyProfitRatio);
            log.info("이전 누적 수익률 : {}", beforeAccumulationProfitRatio);
            log.info("누적 수익률 : {}", accumulationProfitRatio);

            // 자산 비중 추이
            byte coinAssetPercentage = 0;
            if (endingAssets.compareTo(BigDecimal.ZERO) > 0) {
                coinAssetPercentage = totalCoinEvaluation
                        .divide(endingAssets, 8, RoundingMode.DOWN)
                        .multiply(BigDecimal.valueOf(100))
                        .setScale(2, RoundingMode.DOWN)
                        .byteValue();
            }

            ProfitAssetHistory profitAssetHistory = ProfitAssetHistory.builder()
                    .user(user)
                    .startingAssets(startingAssets)
                    .endingAssets(endingAssets)
                    .dailyProfitAndLoss(dailyProfitAndLoss)
                    .dailyProfitRatio(dailyProfitRatio)
                    .accumulationProfitAndLoss(accumulationProfitAndLoss)
                    .accumulationProfitRatio(accumulationProfitRatio)
                    .coinAssetPercentage(coinAssetPercentage)
                    .settlementDate(yesterday)
                    .build();

            yesterdayProfitAssetHistory.ifPresent(assetHistory -> profitAssetHistory.updateId(assetHistory.getId()));

            profitAssetRepository.save(profitAssetHistory);

            ProfitAssetHistory newProfitAssetHistory = ProfitAssetHistory.builder()
                    .user(user)
                    .startingAssets(endingAssets)
                    .settlementDate(today)
                    .coinAssetPercentage(0)
                    .build();

            profitAssetRepository.save(newProfitAssetHistory);
        }
    }
}

