package com.happyfree.trai.profitasset.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.happyfree.trai.profitasset.entity.ProfitAssetHistory;
import com.happyfree.trai.user.entity.User;

public interface ProfitAssetRepository extends JpaRepository<ProfitAssetHistory, Long> {
	List<ProfitAssetHistory> findByUser(User user);

	Optional<ProfitAssetHistory> findByUserAndSettlementDate(@Param("user") User user, @Param("yesterday") LocalDate yesterday);
}
