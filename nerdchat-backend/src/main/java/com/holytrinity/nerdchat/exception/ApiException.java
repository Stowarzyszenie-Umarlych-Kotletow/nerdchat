package com.holytrinity.nerdchat.exception;

public class ApiException extends RuntimeException {

    private String msg;

    public ApiException(String msg) {
        super(msg);
        this.msg = msg;
    }

    public ApiException(String msg, String innerMsg) {
        super(innerMsg);
        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }
}