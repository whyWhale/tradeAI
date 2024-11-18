package com.happyfree.trai.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.happyfree.trai.auth.service.AuthService;
import com.happyfree.trai.user.dto.InvestmentType;
import com.happyfree.trai.user.dto.SignUp;
import com.happyfree.trai.user.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Tag(name = "사용자")
@RequestMapping("/api/users")
@RequiredArgsConstructor
@RestController
public class UserController {
	private final AuthService authService;
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

	@Operation(
		summary = "로그인 유저 ROLE 조회"
	)
	@ApiResponses(value = {
		@ApiResponse(
			responseCode = "200",
			description = "성공",
			content = @Content(schema = @Schema(type = "string", example = "ROLE_USER", implementation = String.class))
		)
	})
	@GetMapping("/userInfo")
	public ResponseEntity<?> getUserInfo() {
		return ResponseEntity.ok(authService.getRole());
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
