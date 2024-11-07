package com.happyfree.trai.agent.controller;

import com.happyfree.trai.agent.service.AgentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "에이전트")
@RequestMapping("/api/agent-history")
@RestController
@RequiredArgsConstructor
public class AgentController {

	private final AgentService agentService;

	@Operation(summary = "에이전트 판단 조회")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@GetMapping("")
	public ResponseEntity<?> findAgentHistoryByDate(@RequestParam("year") String year, @RequestParam("month") String month, @RequestParam("day") String day) {

		return ResponseEntity.ok(agentService.findAgentHistoryByDate(year, month, day));
	}

	@Operation(summary = "에이전트 요청")
	@ApiResponses(value = {@ApiResponse(responseCode = "200")})
	@GetMapping("/ai")
	public ResponseEntity<?> requestAgent() {
		agentService.sendAssetsDataToAgent();

		return ResponseEntity.ok().build();
	}
}
