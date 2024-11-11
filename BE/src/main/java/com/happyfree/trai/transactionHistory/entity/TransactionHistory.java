package com.happyfree.trai.transactionHistory.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.happyfree.trai.agent.entity.Agent;
import com.happyfree.trai.global.common.BaseEntity;
import com.happyfree.trai.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Entity
public class TransactionHistory extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	private User user;

	@OneToOne(fetch = FetchType.LAZY)
	private Agent agent;

	private String uuid;

	private String side;

	private String orderType;

	private String price;

	private String state;

	@Builder.Default
	private String market = "KRW-BTC";

	private String paidFee;

	private String executedVolume;

	private BigDecimal executedFunds;

	private BigDecimal averagePrice;

	private Integer tradesCount;

	private BigDecimal totalEvaluation;

	private BigDecimal totalAmount;

	private BigDecimal profitAndLoss;

	private LocalDateTime orderCreatedAt;

	public void updateUser(User user) { this.user = user; }

	public void updateTotalEvaluation(BigDecimal totalEvaluation) { this.totalEvaluation = totalEvaluation; }

	public void updateTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

	public void updateSide(String side) { this.side = side; }

	public void updateAveragePrice(BigDecimal averagePrice) { this.averagePrice = averagePrice; }

	public void updateProfitAndLoss(BigDecimal profitAndLoss) { this.profitAndLoss = profitAndLoss; }

	public void updateAgent(Agent agent) { this.agent = agent; }
}
