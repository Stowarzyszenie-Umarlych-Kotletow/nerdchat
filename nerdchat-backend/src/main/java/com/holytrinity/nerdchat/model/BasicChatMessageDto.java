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
        return new BasicChatMessageDto(msg.getId(),
                msg.getChatRoom().getPublicId(),
                msg.getChatRoomMember().getId(),
                msg.getChatRoomMember().getUser().getNickname(),
                msg.getChatRoomMember().getUser().getFullName(),
                msg.getContent(),
                msg.getSentAt());
    }
}
