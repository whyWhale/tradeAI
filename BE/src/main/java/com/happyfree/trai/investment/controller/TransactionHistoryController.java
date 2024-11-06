package com.happyfree.trai.investment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.happyfree.trai.investment.dto.LatestTransactionHistory;
import com.happyfree.trai.investment.dto.TodayTransactionHistory;
import com.happyfree.trai.investment.service.TransactionHistoryService;
import com.happyfree.trai.profitasset.dto.AssetProportion;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "거래내역")
@RequestMapping("/api/transaction-histories")
@RestController
public class TransactionHistoryController {
	@Autowired
	TransactionHistoryService transactionHistoryService;

	@Operation(summary = "일별 거래 내역 조회")
	@ApiResponses(value = {
		@ApiResponse(
			responseCode = "200",
			description = "조회 성공",
			content = @Content(array = @ArraySchema(schema = @Schema(implementation = TodayTransactionHistory.class)))
		)
	})
	@GetMapping("")
	public ResponseEntity<?> a(@RequestParam("year") String year, @RequestParam("month") String month,
		@RequestParam("day") String day) {
		return ResponseEntity.ok(transactionHistoryService.today(year, month, day));
	}

	@Operation(summary = "투자내역 이번달 조회 - 최근 거래 내역 조회")
	@ApiResponses(value = {
		@ApiResponse(
			responseCode = "200",
			description = "조회 성공",
			content = @Content(array = @ArraySchema(schema = @Schema(implementation = LatestTransactionHistory.class)))
		)
	})
	@GetMapping("/latest")
	public ResponseEntity<?> b() {
		return ResponseEntity.ok(transactionHistoryService.latest());
	}

}


