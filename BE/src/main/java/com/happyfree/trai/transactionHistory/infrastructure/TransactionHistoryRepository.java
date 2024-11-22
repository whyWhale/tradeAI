package com.happyfree.trai.transactionhistory.infrastructure;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.happyfree.trai.transactionhistory.domain.TransactionHistory;
import com.happyfree.trai.user.domain.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory, Long> {
	List<TransactionHistory> findByUserOrderByCreatedAtDesc(User user);

	@Query("SELECT t " +
			"FROM TransactionHistory t " +
			"WHERE t.user = :user AND DATE(t.orderCreatedAt) = :date " +
			"ORDER BY t.orderCreatedAt DESC")
	List<TransactionHistory> findByUserAndDate(@Param("user") User user, @Param("date") LocalDate date);

	List<TransactionHistory> findTop10ByUserOrderByCreatedAtDesc(User user);
}