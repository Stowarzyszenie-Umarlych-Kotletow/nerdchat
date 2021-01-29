package com.holytrinity.nerdchat.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class ReactionCountDto {
    private int messageId;
    private int emojiId;
    private long count;
    private boolean selected;

    public ReactionCountDto(int messageId, int emojiId, long count, int reacted) {
        this.messageId = messageId;
        this.emojiId = emojiId;
        this.count = count;
        this.selected = reacted > 0;
    }
}
