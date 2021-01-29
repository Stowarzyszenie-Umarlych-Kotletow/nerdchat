package com.holytrinity.nerdchat.config;

import com.holytrinity.nerdchat.exception.ApiException;
import com.holytrinity.nerdchat.model.http.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class ExceptionHandler {

    @org.springframework.web.bind.annotation.ExceptionHandler(ApiException.class)
    public ResponseEntity<?> handle(ApiException ex) {
        return new ResponseEntity<>(new ApiResponse<>(null, ex.getMsg()), HttpStatus.BAD_REQUEST);
    }
}
