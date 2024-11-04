package com.happyfree.trai.user.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.happyfree.trai.user.dto.SignUp;
import com.happyfree.trai.user.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Tag(name = "사용자")
@RequestMapping("/api/users")
@RestController
public class UserController {

	@Autowired
	UserService userService;

	@Value("${upbit.api.accesskey}")
	private String accessKey;

	@Value("${upbit.api.secretkey}")
	private String secretKey;

	@Operation(summary = "jwt")
	@ApiResponses(value = {
		@ApiResponse(
			responseCode = "200",
			description = "토큰 가져오기 성공",
			content = @Content(schema = @Schema(type = "string", example = "토큰 값"))
		)
	})
	@PostMapping("/token")
	public ResponseEntity<?> signUp() {
		return ResponseEntity.ok("Bearer " + JWT.create()
			.withClaim("access_key", accessKey)
			.withClaim("nonce", UUID.randomUUID().toString())
			.sign(Algorithm.HMAC256(secretKey)));
	}

	@Operation(summary = "회원가입")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@PostMapping("/join")
	public void signUp(@RequestBody SignUp signup) {
		userService.save(signup);
	}

	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@PostMapping("/login")
	public void login(@RequestBody SignUp signUp) {
	}

	@Operation(summary = "로그아웃")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@PostMapping("/logout")
	public void logout() {

	}
}
