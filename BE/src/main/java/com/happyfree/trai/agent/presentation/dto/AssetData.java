package com.happyfree.trai.agent.presentation.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.happyfree.trai.profitAsset.presentation.dto.RecentInvestmentSummary;
import com.happyfree.trai.transactionhistory.presentation.dto.RecentTransactionHistory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class AssetData {
    private Long userId;
    private float availableAmount;
    private float btcBalanceKrw;
    private String investmentType;
    private List<RecentInvestmentSummary> investmentPerformanceSummary;
    private List<RecentTransactionHistory> bitcoinPositionHistory;
}