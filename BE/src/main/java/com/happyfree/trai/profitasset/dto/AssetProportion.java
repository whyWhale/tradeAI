package com.happyfree.trai.profitasset.dto;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class AssetProportion {
	@Schema(description = "코인 비중", example = "80.32")
	double coinPercentage;
	@Schema(description = "생성일자", example = "2024-01-02")
	LocalDate createdAt;
}
