package com.holytrinity.nerdchat.model.http;

import lombok.Data;

@Data
public class CreateAccountRequest {
    private String nickname;
    private String firstName;
    private String lastName;
    private String password;
}
