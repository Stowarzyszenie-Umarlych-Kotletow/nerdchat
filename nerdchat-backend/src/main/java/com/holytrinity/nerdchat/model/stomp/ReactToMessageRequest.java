package com.holytrinity.nerdchat.model.stomp;

import lombok.Data;

import java.util.UUID;

@Data
public class ReactToMessageRequest {
    private UUID roomId;
    private int messageId;
    private int emojiId;
    private boolean state;
}
