package com.happyfree.trai.investment.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.happyfree.trai.auth.service.AuthService;
import com.happyfree.trai.investment.controller.dto.LatestTransactionHistory;
import com.happyfree.trai.investment.entity.InvestmentHistory;
import com.happyfree.trai.investment.repository.InvestmentHistoryRepository;
import com.happyfree.trai.user.entity.User;

@Service
public class TransactionHistoryService {
	@Autowired
	AuthService authService;
	@Autowired
	InvestmentHistoryRepository investmentHistoryRepository;

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
