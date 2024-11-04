package com.happyfree.trai.profitasset.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.happyfree.trai.profitasset.dto.AssetProportion;
import com.happyfree.trai.profitasset.service.ProfitAssetService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Tag(name = "자산")
@RequestMapping("/api/assets")
@RestController
public class AssetController {
	@Autowired
	ProfitAssetService profitAssetService;

	@Operation(summary = "일일별 자산 비중 추이 조회")
	@ApiResponses(value = {
		@ApiResponse(
			responseCode = "200",
			description = "조회 성공",
			content = @Content(array = @ArraySchema(schema = @Schema(implementation = AssetProportion.class)))
		)
	})
	@GetMapping("/daily")
	public ResponseEntity<?> a() {
		return ResponseEntity.ok(profitAssetService.assetProportion());
	}
}
