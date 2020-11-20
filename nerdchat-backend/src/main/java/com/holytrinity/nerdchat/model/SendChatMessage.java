package com.holytrinity.nerdchat.model;

import lombok.Data;

import java.util.UUID;

@Data
public class SendChatMessage {
    private UUID channelId;
    private UUID senderId;
    private String content;
}
