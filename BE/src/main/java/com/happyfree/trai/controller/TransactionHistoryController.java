package com.happyfree.trai.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "거래내역")
@RequestMapping("/api/transaction-histories")
@RestController
public class TransactionHistoryController {

	@Operation(summary = "일별 자산 비중 추이 조회")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@GetMapping("")
	public void a(@RequestParam("year") String year,@RequestParam("month") String month,@RequestParam("day") String day) {

	}

	@Operation(summary = "최근 거래 내역 조회")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@GetMapping("/latest")
	public void b(@RequestParam("year") String year,@RequestParam("month") String month,@RequestParam("day") String day) {

	}

}


