package com.happyfree.trai.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "현재 로그인한 유저가 없습니다."),
    JSON_PROCESSING(HttpStatus.BAD_REQUEST, "AI 요청에서 JSON 처리 중 오류가 발생했습니다."),
    ;

    private final HttpStatus httpStatus;
    private final String message;
}
