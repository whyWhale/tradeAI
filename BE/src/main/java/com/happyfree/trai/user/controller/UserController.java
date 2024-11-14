package com.happyfree.trai.user.controller;

import com.happyfree.trai.user.dto.InvestmentType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
@RequiredArgsConstructor
@RestController
public class UserController {

	private final UserService userService;

	@Operation(summary = "회원가입")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@PostMapping("/join")
	public void signUp(@RequestBody SignUp signup) {
		userService.save(signup);
	}

	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@PostMapping("/login")
	public void login() {
	}

	@Operation(summary = "로그아웃")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@PostMapping("/logout")
	public void logout() {

	}

	@Operation(summary = "이메일 중복 확인")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@GetMapping("/check")
	public boolean logout(@RequestParam(name = "email") String email) {
		return userService.findByEmail(email);
	}

	@Operation(summary = "투자 성향 업데이트")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@PatchMapping("/investment-type")
	public ResponseEntity<?> updateInvestmentType(@RequestBody InvestmentType investmentType) {
		return ResponseEntity.ok(userService.saveInvestmentType(investmentType));
	}

	@Operation(summary = "투자 성향 가져오기")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@GetMapping("/investment-type")
	public ResponseEntity<?> a() {
		return ResponseEntity.ok(userService.it());
	}
}
