package com.holytrinity.nerdchat.model.http;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAccountRequest {
    private String nickname;
    private String firstName;
    private String lastName;
    private String password;
}
