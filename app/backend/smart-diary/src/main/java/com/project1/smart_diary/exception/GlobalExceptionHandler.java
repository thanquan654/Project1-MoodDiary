package com.project1.smart_diary.exception;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(ErrorCode.UNCATEGORIZEO_EXCEPTION.getCode())
                .message(ex.getMessage())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }

    @ExceptionHandler(ApplicationException.class)
    public ResponseEntity<ErrorResponse> handleApplicationException(ApplicationException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .status(errorCode.getHttpStatusCode().value())
                .build();

        return ResponseEntity.status(errorCode.getHttpStatusCode().value())
                .body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("code", 1234);
        body.put("status", HttpStatus.BAD_REQUEST.value());
        List<String> errorMessages = ex.getBindingResult()
                .getAllErrors()
                .stream()
                .map(ObjectError::getDefaultMessage)
                .toList();
        body.put("message", errorMessages);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxSizeException() {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(ErrorCode.IMAGE_SIZE_EXCEEDED.getCode())
                .message(ErrorCode.IMAGE_SIZE_EXCEEDED.getMessage())
                .status(ErrorCode.IMAGE_SIZE_EXCEEDED.getHttpStatusCode().value())
                .build();

        return ResponseEntity.status(ErrorCode.IMAGE_SIZE_EXCEEDED.getHttpStatusCode())
                .body(errorResponse);
    }
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(ErrorCode.INVALID_DATE_FORMAT.getCode())
                .message(ErrorCode.INVALID_DATE_FORMAT.getMessage())
                .status(ErrorCode.INVALID_DATE_FORMAT.getHttpStatusCode().value())
                .build();
        return ResponseEntity.status(ErrorCode.INVALID_DATE_FORMAT.getHttpStatusCode()).body(errorResponse);
    }

}