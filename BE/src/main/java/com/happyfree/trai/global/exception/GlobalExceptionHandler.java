package com.happyfree.trai.global.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(BusinessException.class)
	public ResponseEntity<String> handleBusinessException(BusinessException e) {
		ErrorCode errorCode = e.getErrorCode();
		log.error(errorCode.getServerMessage(), e);
		return ResponseEntity
			.status(errorCode.getCustomCode())
			.body(errorCode.getClientMessage());
	}
}

