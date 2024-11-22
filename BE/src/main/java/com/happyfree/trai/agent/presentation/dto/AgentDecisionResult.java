package com.happyfree.trai.agent.presentation.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AgentDecisionResult {
    private String jsonData;
    private LocalDateTime createdAt;
}
