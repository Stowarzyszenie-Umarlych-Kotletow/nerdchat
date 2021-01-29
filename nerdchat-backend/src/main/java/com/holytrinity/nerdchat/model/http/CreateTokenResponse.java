package com.holytrinity.nerdchat.model.http;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateTokenResponse {
    private String nickname;
    private String token;
}
