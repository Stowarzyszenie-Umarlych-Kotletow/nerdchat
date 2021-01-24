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
public class ChatMessageDto {
    private int messageId;
    private UUID chatRoomId;
    private String senderNickname;
    private String senderName;
    private Date sentAt;
    private ChatMessageStatus status;
    private String content;

    public static ChatMessageDto from(ChatMessage msg) {
        var member = msg.getChatRoomMember();
        return new ChatMessageDto(msg.getId(),
                member.getChatRoom().getPublicId(),
                member.getUser().getNickname(),
                member.getUser().getFullName(),
                msg.getSentAt(),
                msg.getMessageStatus(),
                msg.getContent());
    }

}
