package com.happyfree.trai.agent.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.happyfree.trai.global.common.BaseEntity;
import com.happyfree.trai.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "agent_history")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Agent extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String jsonData;
}