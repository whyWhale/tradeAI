package com.happyfree.trai.transactionHistory.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.happyfree.trai.transactionHistory.entity.TransactionHistory;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
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
                .agentId(transactionHistory.getAgent().getId())
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
