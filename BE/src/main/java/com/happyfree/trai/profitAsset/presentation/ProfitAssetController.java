package com.happyfree.trai.profitAsset.presentation;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;

import com.happyfree.trai.profitAsset.presentation.dto.AssetsDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.happyfree.trai.profitAsset.presentation.dto.TransactionSummary;
import com.happyfree.trai.profitAsset.application.ProfitAssetService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "수익자산")
@RequestMapping("/api/investments")
@RequiredArgsConstructor
@RestController
public class ProfitAssetController {

	private final ProfitAssetService profitAssetService;

	@Operation(summary = "투자손익 조회")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = Page.class)))
	})
	@GetMapping("")
	public ResponseEntity<?> getTransactionProfitAndLoss(Pageable pageable) {
		return ResponseEntity.ok(profitAssetService.detail(pageable));
	}

	@Operation(summary = "투자요약 조회")
	@ApiResponses(value = {
		@ApiResponse(
			responseCode = "200",
			description = "투자 요약 가져오기",
			content = @Content(schema = @Schema(type = "string", example = "success", implementation = TransactionSummary.class))
		)
	})
	@GetMapping("/summary")
	public ResponseEntity<?> getTransactionSummary() throws
		JsonProcessingException,
		UnsupportedEncodingException,
		NoSuchAlgorithmException {
		return ResponseEntity.ok(profitAssetService.getTotalProfit());
	}

	@Operation(summary = "자산 현황 조회")
	@ApiResponses(value = {
			@ApiResponse(
					responseCode = "200",
					description = "자산 현황 가져오기",
					content = @Content(schema = @Schema(type = "string", example = "success", implementation = AssetsDetail.class))
			)
	})
	@GetMapping("/assets")
	public ResponseEntity<?> getAssetsDetail() throws UnsupportedEncodingException, NoSuchAlgorithmException, JsonProcessingException {
		return ResponseEntity.ok(profitAssetService.getAssetsDetail());
	}
}
