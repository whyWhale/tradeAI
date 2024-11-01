package com.happyfree.trai.investment.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.happyfree.trai.investment.entity.InvestmentHistory;
import com.happyfree.trai.user.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InvestmentHistoryRepository extends JpaRepository<InvestmentHistory, Long> {
	List<InvestmentHistory> findByUserOrderByCreatedAt(User user);

	@Query("SELECT i " +
			"FROM InvestmentHistory i " +
			"WHERE i.user = :user AND DATE(i.orderCreatedAt) = :date")
	List<InvestmentHistory> findByUserAndDate(@Param("user") User user, @Param("date") LocalDate date);
}
