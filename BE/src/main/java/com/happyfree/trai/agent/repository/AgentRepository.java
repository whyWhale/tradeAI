package com.happyfree.trai.agent.repository;

import com.happyfree.trai.agent.entity.Agent;
import com.happyfree.trai.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AgentRepository extends JpaRepository<Agent, Long> {
    @Query("SELECT a FROM Agent a WHERE a.user = :user AND DATE(a.createdAt) = :date")
    List<Agent> findByUserAndCreatedAt(@Param("user") User loginUser, @Param("date") LocalDate date);
}
