package com.happyfree.trai.agent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetData {
    private Long userId;
    private BigDecimal totalKRWAssets;
    private BigDecimal totalCoinEvaluation;
}
