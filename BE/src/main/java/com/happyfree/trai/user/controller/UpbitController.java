package com.happyfree.trai.user.controller;

import java.util.UUID;

import com.happyfree.trai.user.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
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

	private final UserService userService;

	public UpbitController(UserService userService) {
		this.userService = userService;
	}

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
	public String getMyAccountInfo(){
		return userService.getAccountInfo();
	}


}
