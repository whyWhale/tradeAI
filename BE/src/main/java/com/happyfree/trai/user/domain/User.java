package com.happyfree.trai.user.domain;

import com.happyfree.trai.global.common.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
public class User extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String email;

	private String password;

	private String role;

	private String accessKey;

	private String secretKey;

	@Column(columnDefinition = "TEXT")
	private String investmentTendency;

	public void updateInvestmentType(String investmentType) {
		this.investmentTendency = investmentType;
	}

}
