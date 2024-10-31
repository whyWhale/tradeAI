package com.happyfree.trai.profitasset.controller.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class InvestSummary {
	private int totalTransactionCount;
	private LocalDateTime latestTransactionTime;
	private LocalDateTime lastTransactionTime;
	private int hold;
	private int bid;
	private int ask;
	private BigDecimal profit;
}
