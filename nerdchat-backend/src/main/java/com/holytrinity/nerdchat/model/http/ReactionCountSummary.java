package com.holytrinity.nerdchat.model.http;

import com.holytrinity.nerdchat.model.ReactionCountDto;
import com.holytrinity.nerdchat.model.ReactionSummaryItem;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class ReactionCountSummary {
    private Date from;
    private Date until;
    private Map<Integer, Map<Integer, ReactionSummaryItem>> data;

    public static Map<Integer, Map<Integer, ReactionSummaryItem>> construct(List<ReactionCountDto> data) {
        var dict = new HashMap<Integer, Map<Integer, ReactionSummaryItem>>();
        if (data == null) return dict; // it's empty anyway

        for (var row : data) {
            var msgId = row.getMessageId();
            var msgContainer = dict.getOrDefault(msgId, null);
            if (msgContainer == null) {
                dict.put(msgId, msgContainer = new HashMap<>());
            }
            msgContainer.put(row.getEmojiId(),
                    new ReactionSummaryItem(row.getEmojiId(), row.getCount(), row.isSelected()));
        }

        return dict;
    }

    public static Map<Integer, Map<Integer, ReactionSummaryItem>> construct(int messageId, List<ReactionCountDto> data) {
        var res = construct(data);
        if (res.size() == 0) {
            res.put(messageId, new HashMap<>());
        }
        return res;
    }

    public static ReactionCountSummary from(Date from, Date until, List<ReactionCountDto> data) {
        return new ReactionCountSummary(from, until, construct(data));
    }

    public static void clearSelections(Map<Integer, Map<Integer, ReactionSummaryItem>> dict) {
        for (var mkv : dict.entrySet()) {
            for (var kv : mkv.getValue().entrySet()) {
                kv.getValue().setSelected(null);
            }
        }
    }
}
