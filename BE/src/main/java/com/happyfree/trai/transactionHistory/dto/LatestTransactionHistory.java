package com.happyfree.trai.transactionHistory.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class LatestTransactionHistory {
	@Schema(description = "현재까지체결금액", example = "312312.2212")
	private BigDecimal money;
	@Schema(description = "종류", example = "홀드")
	private String kind;
	@Schema(description = "일시", example = "2024-10-12:09:33:21")
	private LocalDateTime createdAt;
}
