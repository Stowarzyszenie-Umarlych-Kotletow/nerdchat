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
    private UUID chatRoomId;
    private int senderId;
    private String senderNickname;
    private String senderName;
    private String content;
    private Date sentAt;

    public static BasicChatMessageDto from(ChatMessage msg) {
        var member = msg.getChatRoomMember();
        return new BasicChatMessageDto(msg.getId(),
                member.getChatRoom().getPublicId(),
                member.getId(),
                member.getUser().getNickname(),
                member.getUser().getFullName(),
                msg.getContent(),
                msg.getSentAt());
    }
}
