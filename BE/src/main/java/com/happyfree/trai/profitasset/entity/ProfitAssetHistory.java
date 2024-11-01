package com.happyfree.trai.profitasset.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.happyfree.trai.global.common.BaseEntity;
import com.happyfree.trai.user.entity.User;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class ProfitAssetHistory extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	private User user;

	private BigDecimal startingAssets;

	private BigDecimal endingAssets;

	private BigDecimal dailyProfitAndLoss;

	private BigDecimal dailyProfitRatio;

	private BigDecimal accumulationProfitAndLoss;

	private BigDecimal accumulationProfitRatio;

	private Byte coinAssetPercentage;

	private LocalDate settlementDate;

}
