package com.holytrinity.nerdchat.model.http;

import lombok.Data;

@Data
public class CreateTokenRequest {
    private String nickname;
    private String password;
}
