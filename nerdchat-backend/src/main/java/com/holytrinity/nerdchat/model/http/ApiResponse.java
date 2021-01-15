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
    public ApiResponse(T data, String error) {
        setData(data);
        setMessage(error);
        setSuccess(false);
    }

    public ApiResponse() {
        setSuccess(false);
        setMessage("");
    }
}
