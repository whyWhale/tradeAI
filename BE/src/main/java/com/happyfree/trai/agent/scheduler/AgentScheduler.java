package com.happyfree.trai.agent.scheduler;

import com.happyfree.trai.agent.service.AgentService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AgentScheduler {

    private final AgentService agentService;

    @Scheduled(cron = "0 0 0,4,8,12,16,20 * * *") // 4시간 단위
    public void saveProfitAssetHistory() {
        agentService.sendAssetsDataToAgent();
    }

//    @PostConstruct
//    public void init() {
//        System.out.println(1);
//        saveProfitAssetHistory(); // 애플리케이션 시작 시 즉시 실행
//    }
}

