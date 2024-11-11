package com.happyfree.trai.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "현재 로그인한 유저가 없습니다."),
    AI_PROCESS_ERROR(HttpStatus.BAD_REQUEST, "AI 요청 처리 중 오류가 발생했습니다."),
    ASSET_DATA_ERROR(HttpStatus.BAD_REQUEST, "Asset 데이터를 만들던 중에 오류가 발생했습니다."),
    SEARCH_INVESTMENT_ERROR(HttpStatus.BAD_REQUEST, "거래 내역 검색 중 오류가 발생했습니다."),
    ORDER_ERROR(HttpStatus.BAD_REQUEST, "주문하기 진행 중 오류가 발생했습니다."),
    ORDER_AMOUNT_TOO_SMALL(HttpStatus.BAD_REQUEST, "주문 금액이 6000원 이하입니다."),
    AGENT_NOT_FOUND(HttpStatus.NOT_FOUND, "AI Agent 기록이 없습니다."),
    ;

    private final HttpStatus httpStatus;
    private final String message;
}
