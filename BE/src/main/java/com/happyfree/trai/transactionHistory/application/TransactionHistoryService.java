package com.happyfree.trai.transactionhistory.application;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.happyfree.trai.transactionhistory.presentation.dto.TodayTransactionHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.happyfree.trai.authentication.application.AuthService;
import com.happyfree.trai.transactionhistory.presentation.dto.LatestTransactionHistory;
import com.happyfree.trai.transactionhistory.domain.TransactionHistory;
import com.happyfree.trai.transactionhistory.infrastructure.TransactionHistoryRepository;
import com.happyfree.trai.user.domain.User;
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

        return all.stream()
                .map(TodayTransactionHistory::from)
                .collect(Collectors.toList());
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
