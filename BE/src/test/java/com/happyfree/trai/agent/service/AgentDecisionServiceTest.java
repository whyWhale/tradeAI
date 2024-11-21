package com.happyfree.trai.agent.service;

import static org.assertj.core.api.Assertions.*;

import java.time.chrono.ChronoLocalDateTime;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.happyfree.trai.agent.dto.AgentDecisionResult;
import com.happyfree.trai.agent.entity.AgentDecision;
import com.happyfree.trai.agent.repository.AgentRepository;

@SpringBootTest
class AgentDecisionServiceTest {

	@Autowired
	AgentService agentService;

	@Autowired
	AgentRepository agentRepository;

	@DisplayName("에이전트가 내린 판단 정보들을 가져온다")
	@Test
	void testGetAgentDecisionHistory() {
		//given
		AgentDecision savedAgentDecision = agentRepository.save(new AgentDecision("test data.."));
		//when
		AgentDecisionResult agentDecisionHistory = agentService.getAgentDecisionHistory(savedAgentDecision.getId());
		//then
		assertThat(agentDecisionHistory).isNotNull();
		assertThat(agentDecisionHistory.getJsonData()).isEqualTo(savedAgentDecision.getJsonData());
		assertThat(agentDecisionHistory.getCreatedAt().withNano(0)).isEqualTo(savedAgentDecision.getCreatedAt().withNano(0));
	}

	@DisplayName("에이전트가 내린 판단 정보가 없어도 예외를 발생시키지 않는다.")
	@Test
	void testGetEmptyAgentDecisionHistory() {
		//given
		Long NotExistedId = 73812312L;
		String expectedJson = "";
		//when
		AgentDecisionResult agentDecisionHistory = agentService.getAgentDecisionHistory(NotExistedId);
		//then
		assertThat(agentDecisionHistory).isNotNull();
		assertThat(agentDecisionHistory.getJsonData()).isEqualTo(expectedJson);
		assertThat(agentDecisionHistory.getCreatedAt()).isNotNull();
	}
}