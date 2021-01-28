package com.holytrinity.nerdchat.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReactionSummaryItem {
    private int emojiId;
    private long count;
    private Boolean selected;
}
