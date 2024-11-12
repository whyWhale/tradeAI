package com.happyfree.trai.profitAsset.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.happyfree.trai.profitAsset.entity.ProfitAssetHistory;
import com.happyfree.trai.user.entity.User;

public interface ProfitAssetRepository extends JpaRepository<ProfitAssetHistory, Long> {
	Page<ProfitAssetHistory> findByUserAndCreatedAtBeforeOrderByCreatedAtDesc(User user, Pageable pageable, LocalDateTime date);

	List<ProfitAssetHistory> findByUserAndSettlementDateLessThanOrderBySettlementDateDesc(User user, LocalDate today);

	List<ProfitAssetHistory> findTop5ByUserAndSettlementDateLessThanOrderBySettlementDateDesc(User user, LocalDate today);

	Optional<ProfitAssetHistory> findByUserAndSettlementDate(@Param("user") User user,
		@Param("yesterday") LocalDate yesterday);


}
