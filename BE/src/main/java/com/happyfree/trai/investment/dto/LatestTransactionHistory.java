package com.happyfree.trai.investment.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class LatestTransactionHistory {
	private BigDecimal money;
	private String kind;
	private LocalDateTime createdAt;
}
