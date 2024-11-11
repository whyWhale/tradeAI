package com.happyfree.trai.agent.repository;

import com.happyfree.trai.agent.entity.Agent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentRepository extends JpaRepository<Agent, Long> {
}
