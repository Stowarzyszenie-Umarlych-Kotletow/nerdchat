package com.holytrinity.nerdchat.model.http;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
public class CreateTokenResponse {
    private String nickname;
    private String token;
}
