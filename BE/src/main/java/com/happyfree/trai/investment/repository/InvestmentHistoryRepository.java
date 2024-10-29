package com.happyfree.trai.investment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.happyfree.trai.investment.entity.InvestmentHistory;
import com.happyfree.trai.user.entity.User;

public interface InvestmentHistoryRepository extends JpaRepository<InvestmentHistory, Long> {
	List<InvestmentHistory> findByUserOrderByCreatedAt(User user);
}
