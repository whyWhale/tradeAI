package com.happyfree.trai.agent.infrastructure;

import com.happyfree.trai.agent.domain.AgentDecision;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentRepository extends JpaRepository<AgentDecision, Long> {
}
