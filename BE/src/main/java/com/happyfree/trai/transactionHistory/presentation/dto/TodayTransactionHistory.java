package com.happyfree.trai.transactionhistory.presentation.dto;

import com.happyfree.trai.transactionhistory.domain.TransactionHistory;
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

    public static TodayTransactionHistory from(TransactionHistory transactionHistory) {
        return TodayTransactionHistory.builder()
                .id(transactionHistory.getId())
                .agentId(transactionHistory.getAgentDecision().getId())
                .price(transactionHistory.getPrice())
                .averagePrice(transactionHistory.getAveragePrice())
                .side(transactionHistory.getSide())
                .executedFunds(transactionHistory.getExecutedFunds())
                .totalEvaluation(transactionHistory.getTotalEvaluation())
                .totalAmount(transactionHistory.getTotalAmount())
                .profitAndLoss(transactionHistory.getProfitAndLoss())
                .orderCreatedAt(transactionHistory.getOrderCreatedAt())
                .build();
    }
}
