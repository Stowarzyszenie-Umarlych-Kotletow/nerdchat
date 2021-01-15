package com.holytrinity.nerdchat.model.stomp;

import lombok.Data;

import java.util.UUID;

@Data
public class EditRoomCodeRequest {
    private UUID chatRoomId;
    private String joinCode;
}
