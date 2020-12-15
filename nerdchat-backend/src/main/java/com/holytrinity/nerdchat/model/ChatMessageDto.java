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
    private UUID messageId;
    private UUID chatRoomId;
    private UUID senderId;
    private String senderName;
    private Date sentAt;
    private ChatMessageStatus status;
    private String content;

    public static ChatMessageDto from(ChatMessage msg) {
        return new ChatMessageDto(msg.getId(),
                msg.getChatRoom().getId(),
                msg.getChatRoomMember().getUser().getId(),
                msg.getChatRoomMember().getUser().getFullName(),
                msg.getSentAt(),
                msg.getMessageStatus(),
                msg.getContent());
    }

}
