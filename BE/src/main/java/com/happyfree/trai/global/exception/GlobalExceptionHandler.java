package com.happyfree.trai.global.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponse> handleCustomException(CustomException e) {
        ErrorCode errorCode = e.getErrorCode();

        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(makeErrorResponse(errorCode));
    }

    private ErrorResponse makeErrorResponse(ErrorCode errorCode) {
        return new ErrorResponse(
                errorCode.getHttpStatus().toString(),
                errorCode.getMessage()
        );
    }
}

