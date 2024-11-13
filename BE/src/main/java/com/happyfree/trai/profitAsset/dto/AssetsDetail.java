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
    private BigDecimal bitcoinAmount;
    private BigDecimal bitcoinCurrentPrice;
    private BigDecimal bitcoinAveragePrice;
    private BigDecimal startingAssets;
    private BigDecimal totalDepositAmount;
    private BigDecimal totalWithdrawAmount;
    private BigDecimal totalProfitAndLoss;
}
