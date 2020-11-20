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
    private UUID messageId;
    private UUID chatRoomId;
    private UUID senderId;
    private String senderName;
    private String contentPreview;
    private Date sentAt;

    public static BasicChatMessageDto from(ChatMessage msg) {
        return new BasicChatMessageDto(msg.getId(),
                msg.getChatRoom().getId(),
                msg.getChatRoomMember().getUser().getId(),
                msg.getChatRoomMember().getUser().getFullName(),
                msg.getContent(),
                msg.getSentAt());
    }
}
