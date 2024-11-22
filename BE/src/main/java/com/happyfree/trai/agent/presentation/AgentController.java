package com.happyfree.trai.agent.presentation;

import com.happyfree.trai.agent.application.AgentService;
import com.happyfree.trai.agent.presentation.dto.AgentDecisionResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.concurrent.CompletableFuture;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "에이전트")
@RequestMapping("/api/agent-history")
@RestController
public class AgentController {

    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @Operation(summary = "에이전트 판단 조회")
    @ApiResponses(value = {@ApiResponse(responseCode = "200")})
    @GetMapping
    public AgentDecisionResult findAgentHistoryById(@RequestParam("agentId") Long agentId) {
        return agentService.getAgentDecisionHistory(agentId);
    }

    @Operation(summary = "에이전트 테스트")
    @ApiResponses(value = {@ApiResponse(responseCode = "200")})
    @GetMapping("/ai")
    public ResponseEntity<?> requestAgent() {
        CompletableFuture.runAsync(agentService::requestAIAnalysisForAllAdmins);

        return ResponseEntity.ok().build();
    }
}
