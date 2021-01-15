package com.holytrinity.nerdchat.model.http;

import lombok.Data;

@Data
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    public ApiResponse(T data) {
        setData(data);
        setSuccess(true);
    }

    public ApiResponse(String error) {
        setSuccess(false);
        setMessage(error);
    }

    public ApiResponse() {
        setSuccess(false);
        setMessage("");
    }
}
