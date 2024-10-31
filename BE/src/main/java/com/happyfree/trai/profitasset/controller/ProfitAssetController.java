package com.happyfree.trai.profitasset.controller;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.happyfree.trai.profitasset.controller.dto.InvestSummary;
import com.happyfree.trai.profitasset.service.ProfitAssetService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "수익자산")
@RequestMapping("/api/investments")
@RestController
public class ProfitAssetController {
	@Autowired
	ProfitAssetService profitAssetService;

	@Operation(summary = "투자손익 조회")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@GetMapping("")
	public void a(@RequestParam(name = "page") String page) {

	}

	@Operation(summary = "투자요약 조회")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@GetMapping("/summary")
	public InvestSummary b() throws JsonProcessingException, UnsupportedEncodingException, NoSuchAlgorithmException {
		return profitAssetService.getSummary();
	}
}
