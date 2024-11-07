package com.happyfree.trai.profitAsset.scheduler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.happyfree.trai.profitAsset.service.ProfitAssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;

@Component
@RequiredArgsConstructor
public class ProfitAssetScheduler {

    private final ProfitAssetService profitAssetService;

    @Scheduled(cron = "0 0 0 * * *") // 매일 자정
    public void saveProfitAssetHistory() throws UnsupportedEncodingException, NoSuchAlgorithmException, JsonProcessingException {
        profitAssetService.saveDailyProfitAssetHistory();
    }
}
