package com.happyfree.trai.global.exception;

import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

public enum ErrorCode {
	USER_NOT_FOUND(NOT_FOUND, 4040, "사용자를 찾을 수 없습니다.", "유효한 사용자가 아닙니다."),
	AI_PROCESS_ERROR(INTERNAL_SERVER_ERROR, 5000, "관리자에게 문의바랍니다.", "AI 요청 처리 중 오류가 발생했습니다."),
	ASSET_DATA_ERROR(INTERNAL_SERVER_ERROR, 5000, "관리자에게 문의바랍니다.", "Asset 데이터를 만들던 중에 오류가 발생했습니다."),
	SEARCH_INVESTMENT_ERROR(INTERNAL_SERVER_ERROR, 5000, "관리자에게 문의바랍니다.", "거래 내역 검색 중 오류가 발생했습니다."),
	ORDER_ERROR(INTERNAL_SERVER_ERROR, 5000, "관리자에게 문의 바랍니다.", "주문하기 진행 중 오류가 발생했습니다."),
	ORDER_AMOUNT_TOO_SMALL(BAD_REQUEST, 4000, "주문 최소금액으로 주문을 채결할 수 없습니다.", "주문 금액이 6000원 이하입니다.");

	private final HttpStatus httpStatus;
	private final int customCode;
	private final String clientMessage;
	private final String serverMessage;

	public int getCustomCode() {
		return customCode;
	}

	ErrorCode(HttpStatus httpStatus, int customCode, String clientMessage, String serverMessage) {
		this.httpStatus = httpStatus;
		this.customCode = customCode;
		this.clientMessage = clientMessage;
		this.serverMessage = serverMessage;
	}

	public HttpStatus getHttpStatus() {
		return httpStatus;
	}

	public String getClientMessage() {
		return clientMessage;
	}

	public String getServerMessage() {
		return serverMessage;
	}
}
