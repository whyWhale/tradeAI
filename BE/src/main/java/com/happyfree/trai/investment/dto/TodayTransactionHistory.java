package com.happyfree.trai.investment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Data
@AllArgsConstructor
public class TodayTransactionHistory {
    private String price;
    private BigDecimal averagePrice;
    private String side;
    private BigDecimal executedFunds;
    private BigDecimal totalEvaluation;
    private BigDecimal totalAmount;
    private LocalDateTime orderCreatedAt;
}
