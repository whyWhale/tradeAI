package com.happyfree.trai.agent.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.happyfree.trai.global.common.BaseEntity;
import com.happyfree.trai.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class AnalysisResult extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String jsonData;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    public void updateUser(User user) {
        this.user = user;
    }
}