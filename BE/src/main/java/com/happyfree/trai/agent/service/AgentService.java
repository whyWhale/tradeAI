package com.happyfree.trai.agent.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.happyfree.trai.agent.dto.AnalysisResult;
import com.happyfree.trai.agent.dto.AssetData;
import com.happyfree.trai.agent.repository.AnalysisResultRepository;
import com.happyfree.trai.global.exception.CustomException;
import com.happyfree.trai.profitasset.service.ProfitAssetService;
import com.happyfree.trai.user.entity.User;
import com.happyfree.trai.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import static com.happyfree.trai.global.exception.ErrorCode.JSON_PROCESSING;

@Service
@Transactional
@RequiredArgsConstructor
public class AgentService {

    private final ProfitAssetService profitAssetService;

    private final UserRepository userRepository;

    private final AnalysisResultRepository analysisResultRepository;

    private final WebClient webClient;

    @Value("${upbit.api.accesskey}")
    private String accessKey;

    @Value("${upbit.api.secretkey}")
    private String secretKey;

    @Transactional
    public void sendAssetsDataToAgent() {
        List<User> allAdminUser = userRepository.findByRole("ROLE_ADMIN");

        allAdminUser.forEach(user -> {
            try {
                AssetData assetData = AssetData.builder()
                        .userId(user.getId())
                        .totalCoinEvaluation(profitAssetService.bcv().multiply(profitAssetService.bitp()))
                        .totalKRWAssets(profitAssetService.getTotalKRWAssets(accessKey, secretKey))
                        .build();

                CompletableFuture<AnalysisResult> futureResult = webClient
                        .post()
                        .uri("http://3.35.238.247:8000/ai/analysis")
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(assetData)  // 단일 사용자 데이터만 전송
                        .retrieve()
                        .bodyToMono(AnalysisResult.class)
                        .toFuture();

                // 매수, 매도, 홀드에 대한 판단 확인
                // 매수, 매도라면 주문하기(IOC)

                // 결과를 받아서 사용자 정보를 설정하고 저장
                futureResult.thenAccept(result -> {
                    result.updateUser(user);
                    analysisResultRepository.save(result);
                });



                // 매수, 매도를 하고 거래 체결 내역 확인 -> 거래내역 저장

            } catch (JsonProcessingException e) {
                throw new CustomException(JSON_PROCESSING);
            }
        });
    }

}
