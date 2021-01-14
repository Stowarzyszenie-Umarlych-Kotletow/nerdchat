package com.holytrinity.nerdchat.model.rooms;

import lombok.Data;

import java.util.UUID;

@Data
public class CreateDirectChatResult {
    public boolean isSuccess;
    public boolean isNew;
    public UUID chatRoomId;

    public CreateDirectChatResult() {
        isSuccess = false;
    }
    public CreateDirectChatResult(UUID chatRoomId, boolean isNew) {
        this.chatRoomId = chatRoomId;
        isSuccess = true;
        isNew = isNew;
    }
}
