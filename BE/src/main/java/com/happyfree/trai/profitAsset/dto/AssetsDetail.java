package com.happyfree.trai.profitAsset.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AssetsDetail {
    private BigDecimal totalAmount;
    private BigDecimal totalProfitAndLossRatio;
    private BigDecimal totalInvestment;
    private BigDecimal totalEvaluation;
    private BigDecimal totalKRWAssets;
    private BigDecimal availableAmount;
    private BigDecimal profitAndLoss;
    private BigDecimal profitAndLossRatio;
}
