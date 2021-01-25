package com.holytrinity.nerdchat.model;

import com.holytrinity.nerdchat.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BasicChatMessageDto {
    private int messageId;
    private int senderId;
    private String senderNickname;
    private String senderName;
    private String content;
    private Date sentAt;

    public static BasicChatMessageDto from(ChatMessage msg) {
        var member = msg.getChatRoomMember();
        return new BasicChatMessageDto(msg.getId(),
                member.getId(),
                member.getUser().getNickname(),
                member.getUser().getFullName(),
                msg.getContent(),
                msg.getSentAt());
    }

    public BasicChatMessageDto(int messageId, int senderId, String senderNickname, String senderfName, String senderlName, String content, Date sentAt) {
        this.messageId = messageId;
        this.senderId = senderId;
        this.senderNickname = senderNickname;
        this.senderName = senderfName + " " + senderlName;
        this.content = content;
        this.sentAt = sentAt;
    }
}
