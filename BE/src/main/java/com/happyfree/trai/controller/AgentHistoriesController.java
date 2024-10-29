package com.happyfree.trai.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "에이전트")
@RequestMapping("/api/agent-histories")
@RestController
public class AgentHistoriesController {

	@Operation(summary = "에이전트 판단 조회")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@GetMapping("")
	public void a(@RequestParam("year") String year,@RequestParam("month") String month,@RequestParam("day") String day) {

	}
}
