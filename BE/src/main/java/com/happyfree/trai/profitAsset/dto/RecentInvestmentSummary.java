package com.happyfree.trai.profitAsset.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.happyfree.trai.profitAsset.entity.ProfitAssetHistory;
import lombok.*;
import java.math.BigDecimal;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class RecentInvestmentSummary {
    private String settlementDate;
    private BigDecimal startingAssets;
    private BigDecimal endingAssets;
    private BigDecimal dailyProfitAndLoss;
    private BigDecimal dailyProfitRatio;
    private BigDecimal accumulationProfitAndLoss;
    private BigDecimal accumulationProfitRatio;
    private double coinAssetPercentage;

    public static RecentInvestmentSummary from(ProfitAssetHistory profitAssetHistory) {
        return RecentInvestmentSummary.builder()
                .settlementDate(profitAssetHistory.getSettlementDate().toString())
                .startingAssets(profitAssetHistory.getStartingAssets())
                .endingAssets(profitAssetHistory.getEndingAssets())
                .dailyProfitAndLoss(profitAssetHistory.getDailyProfitAndLoss())
                .dailyProfitRatio(profitAssetHistory.getDailyProfitRatio())
                .accumulationProfitAndLoss(profitAssetHistory.getAccumulationProfitAndLoss())
                .accumulationProfitRatio(profitAssetHistory.getAccumulationProfitRatio())
                .coinAssetPercentage(profitAssetHistory.getCoinAssetPercentage())
                .build();
    }
}
