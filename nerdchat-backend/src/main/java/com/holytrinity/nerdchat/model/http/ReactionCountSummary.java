package com.holytrinity.nerdchat.model.http;

import com.holytrinity.nerdchat.model.ReactionCountDto;
import com.holytrinity.nerdchat.model.ReactionSummaryItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.hibernate.exception.DataException;

import java.util.*;

@Data
@AllArgsConstructor
public class ReactionCountSummary {
    private Date from;
    private Date until;
    private Map<Integer, Map<Integer, ReactionSummaryItem>> data;

    public static Map<Integer, Map<Integer, ReactionSummaryItem>> construct(List<ReactionCountDto> data) {
        var dict = new HashMap<Integer, Map<Integer, ReactionSummaryItem>>();
        if (data != null) {
            for (var d : data) {
                var m = d.getMessageId();
                var msgContainer = dict.getOrDefault(m, null);
                if (msgContainer == null) {
                     dict.put(m, msgContainer = new HashMap<>());
                }
                msgContainer.put(d.getEmojiId(), new ReactionSummaryItem(d.getEmojiId(), d.getCount(), d.isUserReacted()));
            }
        }
        return dict;
    }

    public static Map<Integer, Map<Integer, ReactionSummaryItem>> construct(int messageId, List<ReactionCountDto> data) {
        var res = construct(data);
        if(res.size() == 0) {
            res.put(messageId, new HashMap<>());
        }
        return res;
    }

    public static ReactionCountSummary from(Date from, Date until, List<ReactionCountDto> data) {
        return new ReactionCountSummary(from, until, construct(data));
    }
}
