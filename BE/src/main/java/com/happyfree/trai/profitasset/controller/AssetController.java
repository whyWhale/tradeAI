package com.happyfree.trai.profitasset.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Tag(name = "자산")
@RequestMapping("/api/assets")
@RestController
public class AssetController {
	@Operation(summary = "일일별 자산 비중 추이 조회")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@GetMapping("/daily")
	public void a(@RequestParam("year") String year, @RequestParam("month") String month,
		@RequestParam("day") String day, @AuthenticationPrincipal UserDetails userDetails) {
		log.info("user -> username: {}, password: {}, auth: {} ", userDetails.getUsername(), userDetails.getPassword(),
			userDetails.getAuthorities());
	}
}
