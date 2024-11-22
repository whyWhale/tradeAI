package com.happyfree.trai.agent.domain;

import com.happyfree.trai.global.common.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "agent_decisions")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AgentDecision extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Lob
	@Column(columnDefinition = "LONGTEXT")
	private String jsonData;

	public AgentDecision(String jsonData) {
		this.jsonData = jsonData;
	}

	public Long getId() {
		return id;
	}

	public String getJsonData() {
		return jsonData;
	}
}