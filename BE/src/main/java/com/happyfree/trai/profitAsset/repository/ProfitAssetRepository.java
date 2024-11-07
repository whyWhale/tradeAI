package com.happyfree.trai.profitAsset.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.happyfree.trai.profitAsset.entity.ProfitAssetHistory;
import com.happyfree.trai.user.entity.User;

public interface ProfitAssetRepository extends JpaRepository<ProfitAssetHistory, Long> {
	Page<ProfitAssetHistory> findByUser(User user, Pageable pageable);

	List<ProfitAssetHistory> findByUser(User user);

	Optional<ProfitAssetHistory> findByUserAndSettlementDate(@Param("user") User user,
		@Param("yesterday") LocalDate yesterday);
}
