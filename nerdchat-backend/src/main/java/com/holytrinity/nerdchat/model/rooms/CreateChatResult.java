package com.holytrinity.nerdchat.model.rooms;

import lombok.Data;

import java.util.UUID;

@Data
public class CreateChatResult {
    public boolean isSuccess;
    public boolean isNew;
    public UUID chatRoomId;

    public CreateChatResult() {
        isSuccess = false;
    }
    public CreateChatResult(UUID chatRoomId, boolean isNew) {
        this.chatRoomId = chatRoomId;
        isSuccess = true;
        isNew = isNew;
    }
}
