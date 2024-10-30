package com.happyfree.trai.profitasset.service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.happyfree.trai.auth.service.AuthService;
import com.happyfree.trai.investment.entity.InvestmentHistory;
import com.happyfree.trai.investment.repository.InvestmentHistoryRepository;
import com.happyfree.trai.profitasset.controller.dto.InvestSummary;
import com.happyfree.trai.profitasset.entity.ProfitAssetHistory;
import com.happyfree.trai.profitasset.repository.ProfitAssetRepository;
import com.happyfree.trai.user.entity.User;

@Service
public class ProfitAssetService {

	@Autowired
	ProfitAssetRepository profitAssetRepository;

	@Autowired
	InvestmentHistoryRepository investmentHistoryRepository;

	@Autowired
	AuthService authService;

	@Value("${upbit.api.accesskey}")
	private String accessKey;

	@Value("${upbit.api.secretkey}")
	private String secretKey;

	String serverUrl = "https://api.upbit.com";

	public InvestSummary getSummary() throws JsonProcessingException, UnsupportedEncodingException, NoSuchAlgorithmException {
		User loginUser = authService.getLoginUser();
		Optional<ProfitAssetHistory> pah = profitAssetRepository.findByUserAndSettlementDate(loginUser,
			LocalDate.now().minusDays(1));
		BigDecimal ia = profitAssetRepository.findByUserAndSettlementDate(loginUser, LocalDate.now().minusDays(1)).get().getStartingAssets();
		BigDecimal yp = BigDecimal.ZERO;
		if (pah.isPresent()) {
			yp = pah.get().getDailyProfitRatio();
		}
		BigDecimal todayProfitRatio = tp(ia);
		BigDecimal profit = yp.add(BigDecimal.ONE).multiply(BigDecimal.ONE.add(todayProfitRatio.divide(BigDecimal.valueOf(100)))).subtract(BigDecimal.ONE);
		List<InvestmentHistory> list = investmentHistoryRepository.findByUserOrderByCreatedAt(authService.getLoginUser());
		int bid = 0, hold = 0, ask = 0;
		for (int i = 0; i < list.size(); i++) {
			InvestmentHistory ih = list.get(i);
			String side = ih.getSide();
			if (side.equals("bid")) {
				bid++;
			} else if (side.equals("ask")) {
				ask++;
			} else {
				hold++;
			}
		}

		return InvestSummary.builder().totalTransactionCount(list.size()).latestTransactionTime(list.get(0).getOrderCreatedAt()).latestTransactionTime(list.get(list.size() - 1).getOrderCreatedAt()).bid(bid).ask(ask).hold(hold).profit(profit).build();
	}

	private BigDecimal tp(BigDecimal initialAsset) throws
		NoSuchAlgorithmException,
		UnsupportedEncodingException,
		JsonProcessingException {
		BigDecimal todayWithdrawalSum = with();
		BigDecimal todayDepositSum = td();
		BigDecimal myBitCoinVolume = bcv();
		BigDecimal myTotalMoney = tm();
		BigDecimal currentBitcoinPrice = bitp();
		BigDecimal totalBitCoinValue = myBitCoinVolume.multiply(currentBitcoinPrice);
		return myBitCoinVolume.multiply(currentBitcoinPrice).add(myTotalMoney).subtract(initialAsset).add(todayWithdrawalSum).subtract(todayDepositSum).divide(initialAsset.add(todayDepositSum), 2, BigDecimal.ROUND_HALF_UP).multiply(new BigDecimal("100"));
	}

	public BigDecimal with() throws NoSuchAlgorithmException, UnsupportedEncodingException {
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
		LocalDate today = LocalDate.now();
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

	public BigDecimal bitp() throws JsonProcessingException {
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
		Double openingPrice = jsonArray.get(0).get("opening_price").asDouble();
		if (openingPrice == null) {
			openingPrice = 0.0;
		}
		return new BigDecimal(openingPrice);
	}

	public BigDecimal bcv() throws JsonProcessingException {
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
			if ("KRW-BTC".equals(currency)) {
				Double balance = node.get("balance").asDouble();
				return new BigDecimal(balance);
			}
		}

		return BigDecimal.ZERO;
	}

	public BigDecimal tm() throws JsonProcessingException {
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
		JsonNode root = mapper.readTree(response.getBody());
		JsonNode jsonArray = mapper.readTree(response.getBody());

		for (JsonNode node : jsonArray) {
			String currency = node.get("currency").asText();
			if ("KRW".equals(currency)) {
				Double balance = node.get("balance").asDouble();
				return new BigDecimal(balance);
			}
		}

		return BigDecimal.ZERO;
	}

	public BigDecimal td() throws NoSuchAlgorithmException, UnsupportedEncodingException {
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
		LocalDate today = LocalDate.now();
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

}
