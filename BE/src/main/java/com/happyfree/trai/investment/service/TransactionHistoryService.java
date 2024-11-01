package com.happyfree.trai.investment.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.happyfree.trai.investment.dto.TodayTransactionHistory;
import com.happyfree.trai.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.happyfree.trai.auth.service.AuthService;
import com.happyfree.trai.investment.dto.LatestTransactionHistory;
import com.happyfree.trai.investment.entity.InvestmentHistory;
import com.happyfree.trai.investment.repository.InvestmentHistoryRepository;
import com.happyfree.trai.user.entity.User;

@Service
public class TransactionHistoryService {
	@Autowired
	AuthService authService;
	@Autowired
	InvestmentHistoryRepository investmentHistoryRepository;
    @Autowired
    private UserRepository userRepository;

	public List<TodayTransactionHistory> today(String year, String month, String day) {
		User loginUser = authService.getLoginUser();

		LocalDate date = LocalDate.of(Integer.parseInt(year), Integer.parseInt(month), Integer.parseInt(day));
		List<InvestmentHistory> all = investmentHistoryRepository.findByUserAndDate(loginUser, date);

		List<TodayTransactionHistory> todayTransactionHistories = new ArrayList<>();
		for (InvestmentHistory investmentHistory : all) {
			todayTransactionHistories.add(
					TodayTransactionHistory.builder()
							.price(investmentHistory.getPrice())
							.averagePrice(investmentHistory.getAveragePrice())
							.side(investmentHistory.getSide())
							.executedFunds(investmentHistory.getExecutedFunds())
							.totalEvaluation(investmentHistory.getTotalEvaluation())
							.totalAmount(investmentHistory.getTotalAmount())
							.orderCreatedAt(investmentHistory.getOrderCreatedAt())
							.build()
			);
		}

		return todayTransactionHistories;
	}

	public List<LatestTransactionHistory> latest() {
		User loginUser = authService.getLoginUser();

		List<InvestmentHistory> all = investmentHistoryRepository.findByUserOrderByCreatedAt(loginUser);
		ArrayList<InvestmentHistory> investmentHistories = new ArrayList<>();
		for (int i = 0; i < 30; i++) {
			investmentHistories.add(all.get(i));
		}

		ArrayList<LatestTransactionHistory> latestTransactionHistories = new ArrayList<>();
		for (int i = 0; i < 30; i++) {
			latestTransactionHistories.add(
				LatestTransactionHistory.builder()
					.money(investmentHistories.get(i).getExecutedFunds())
					.kind(investmentHistories.get(i).getSide())
					.createdAt(investmentHistories.get(i).getOrderCreatedAt())
					.build()
			);
		}

		return latestTransactionHistories;
	}

}
