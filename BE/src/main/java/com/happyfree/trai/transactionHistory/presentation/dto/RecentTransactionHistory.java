package com.happyfree.trai.transactionhistory.presentation.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.happyfree.trai.transactionhistory.domain.TransactionHistory;
import lombok.*;
import java.math.BigDecimal;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class RecentTransactionHistory {
    private String orderCreatedAt;
    private long agentId;
    private String price;
    private BigDecimal averagePrice;
    private String side;
    private BigDecimal executedFunds;
    private BigDecimal totalEvaluation;
    private BigDecimal totalAmount;
    private BigDecimal profitAndLoss;

    public static RecentTransactionHistory from(TransactionHistory transactionHistory) {
        return RecentTransactionHistory.builder()
                .orderCreatedAt(transactionHistory.getOrderCreatedAt().toString())
                .agentId(transactionHistory.getAgentDecision().getId())
                .price(transactionHistory.getPrice())
                .averagePrice(transactionHistory.getAveragePrice())
                .side(transactionHistory.getSide())
                .executedFunds(transactionHistory.getExecutedFunds())
                .totalEvaluation(transactionHistory.getTotalEvaluation())
                .totalAmount(transactionHistory.getTotalAmount())
                .profitAndLoss(transactionHistory.getProfitAndLoss())
                .build();
    }
}
