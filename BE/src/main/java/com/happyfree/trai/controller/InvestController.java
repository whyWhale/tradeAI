package com.happyfree.trai.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "투자")
@RequestMapping("/api/investments")
@RestController
public class InvestController {
	@Operation(summary = "투자손익 조회")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@GetMapping("")
	public void a(@RequestParam(name = "page") String page) {

	}

	@Operation(summary = "투자요약 조회")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@GetMapping("/summary")
	public void b() {

	}
}
