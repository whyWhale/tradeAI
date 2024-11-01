package com.happyfree.trai.profitasset.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class InvestSummary {
	@Schema(description = "총 거래수", example = "213781892739812")
	private int totalTransactionCount;
	@Schema(description = "처음 거래 시간", example = "2024-10-12:00:00:33")
	private LocalDateTime firstTransactionTime;
	@Schema(description = "마지막 거래 시간", example = "2099-10-12:00:00:33")
	private LocalDateTime lastTransactionTime;
	@Schema(description = "총 홀드수", example = "3000")
	private int hold;
	@Schema(description = "총 매수수", example = "129310923")
	private int bid;
	@Schema(description = "총 매도수", example = "82123")
	private int ask;
	@Schema(description = "누적 수익률", example = "920.88888%")
	private BigDecimal profit;
}
