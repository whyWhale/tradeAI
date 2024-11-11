package com.happyfree.trai.transactionHistory.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class TodayTransactionHistory {
    private long id;
    private long agentId;
    private String price;
    private BigDecimal averagePrice;
    private String side;
    private BigDecimal executedFunds;
    private BigDecimal totalEvaluation;
    private BigDecimal totalAmount;
    private BigDecimal profitAndLoss;
    private LocalDateTime orderCreatedAt;
}
