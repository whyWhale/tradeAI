package com.happyfree.trai.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RequestMapping("/api/upbits/accounts")
@RestController
public class UpbitController {
	@Value("${upbit.api.accesskey}")
	private String accessKey;

	@Value("${upbit.api.secretkey}")
	private String secretKey;

	@Operation(
		summary = "업비트 나의 자산 정보 가져오기"
	)
	@ApiResponses(value = {
		@ApiResponse(
			responseCode = "200",
			description = " 성공"
		)
	})
	@PostMapping("")
	public String acc(){
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		String sign = JWT.create()
			.withClaim("access_key", accessKey)
			.withClaim("nonce", UUID.randomUUID().toString())
			.sign(Algorithm.HMAC256(secretKey));
		String authToken = "Bearer " + sign;
		headers.set("Authorization", authToken);
		headers.set("Content-Type", "application/json");
		HttpEntity<String> entity = new HttpEntity<>(headers);
		ResponseEntity<String> response = restTemplate.exchange(
			"https://api.upbit.com/v1/accounts",
			HttpMethod.GET,
			entity,
			String.class
		);

		return response.getBody();
	}


}
