package com.happyfree.trai.transactionHistory.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.happyfree.trai.transactionHistory.dto.TodayTransactionHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.happyfree.trai.auth.service.AuthService;
import com.happyfree.trai.transactionHistory.dto.LatestTransactionHistory;
import com.happyfree.trai.transactionHistory.entity.TransactionHistory;
import com.happyfree.trai.transactionHistory.repository.TransactionHistoryRepository;
import com.happyfree.trai.user.entity.User;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class TransactionHistoryService {

	private final AuthService authService;

	private final TransactionHistoryRepository transactionHistoryRepository;

	@Transactional(readOnly = true)
	public List<TodayTransactionHistory> today(String year, String month, String day) {
		User loginUser = authService.getLoginUser();

		LocalDate date = LocalDate.of(Integer.parseInt(year), Integer.parseInt(month), Integer.parseInt(day));
		List<TransactionHistory> all = transactionHistoryRepository.findByUserAndDate(loginUser, date);

		List<TodayTransactionHistory> todayTransactionHistories = new ArrayList<>();
		for (TransactionHistory transactionHistory : all) {
			todayTransactionHistories.add(
				TodayTransactionHistory.builder()
						.id(transactionHistory.getId())
						.agentId(transactionHistory.getAgent().getId())
						.price(transactionHistory.getPrice())
						.averagePrice(transactionHistory.getAveragePrice())
						.side(transactionHistory.getSide())
						.executedFunds(transactionHistory.getExecutedFunds())
						.totalEvaluation(transactionHistory.getTotalEvaluation())
						.totalAmount(transactionHistory.getTotalAmount())
						.profitAndLoss(transactionHistory.getProfitAndLoss())
						.orderCreatedAt(transactionHistory.getOrderCreatedAt())
						.build()
			);
		}

		return todayTransactionHistories;
	}

	@Transactional(readOnly = true)
	public List<LatestTransactionHistory> latest() {
		User loginUser = authService.getLoginUser();

		List<TransactionHistory> all = transactionHistoryRepository.findByUserOrderByCreatedAtDesc(loginUser);
		ArrayList<TransactionHistory> investmentHistories = new ArrayList<>();
		for (int i = 0; i < 30; i++) {
			investmentHistories.add(all.get(i));
		}

		ArrayList<LatestTransactionHistory> latestTransactionHistories = new ArrayList<>();
		for (int i = 0; i < 30; i++) {
			latestTransactionHistories.add(
				LatestTransactionHistory.builder()
					.money(investmentHistories.get(i).getExecutedFunds())
					.volume(investmentHistories.get(i).getExecutedVolume())
					.kind(investmentHistories.get(i).getSide())
					.createdAt(investmentHistories.get(i).getOrderCreatedAt())
					.build()
			);
		}

		return latestTransactionHistories;
	}

}
