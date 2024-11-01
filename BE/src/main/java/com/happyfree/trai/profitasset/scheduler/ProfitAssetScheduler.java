package com.happyfree.trai.profitasset.scheduler;

import com.happyfree.trai.profitasset.service.ProfitAssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ProfitAssetScheduler {
    @Autowired
    ProfitAssetService profitAssetService;

    @Scheduled(cron = "0 0 0 * * *") // 매일 자정
    public void saveProfitAssetHistory() {
        profitAssetService.save();
    }
}
