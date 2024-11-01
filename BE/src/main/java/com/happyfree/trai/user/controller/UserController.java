package com.happyfree.trai.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.happyfree.trai.user.dto.SignUp;
import com.happyfree.trai.user.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "사용자")
@RequestMapping("/api/users")
@RestController
public class UserController {

	@Autowired
	UserService userService;

	@Operation(summary = "회원가입")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@PostMapping("/join")
	public void signUp(@RequestBody SignUp signup) {
		userService.save(signup);
	}

	@Operation(summary = "로그인")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@PostMapping("/login")
	public void login() {

	}

	@Operation(summary = "로그아웃")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@PostMapping("/logout")
	public void logout() {

	}
}
