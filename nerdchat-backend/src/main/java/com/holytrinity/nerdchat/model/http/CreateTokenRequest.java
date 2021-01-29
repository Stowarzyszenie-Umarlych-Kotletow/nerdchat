package com.holytrinity.nerdchat.model.http;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateTokenRequest {
    private String nickname;
    private String password;
}
