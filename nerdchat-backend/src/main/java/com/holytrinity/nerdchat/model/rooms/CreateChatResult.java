package com.holytrinity.nerdchat.model.rooms;

import lombok.Data;

import java.util.UUID;

@Data
public class CreateChatResult {
    private boolean isSuccess;
    private boolean isNew;
    private UUID chatRoomId;

    public CreateChatResult() {
        isSuccess = false;
    }
    public CreateChatResult(UUID chatRoomId, boolean isNew) {
        this.chatRoomId = chatRoomId;
        isSuccess = true;
        this.isNew = isNew;
    }
}
