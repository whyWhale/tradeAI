package com.happyfree.trai.agent.scheduler;

import com.happyfree.trai.agent.service.AgentService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AgentScheduler {

    private final AgentService agentService;

    @Scheduled(cron = "0 0 0,3,6,9,12,15,18,21 * * *") // 4시간 단위
    public void saveProfitAssetHistory() {
        agentService.sendAssetsDataToAgent();
    }
}
