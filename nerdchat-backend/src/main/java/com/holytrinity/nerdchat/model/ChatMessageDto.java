package com.holytrinity.nerdchat.model;

import com.holytrinity.nerdchat.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.swing.*;
import java.util.Date;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto {
    private int messageId;
    private int senderId;
    private UUID chatRoomId;
    private String senderNickname;
    private String senderName;
    private String content;
    private Date sentAt;
    private ChatMessageStatus messageStatus;


    public static ChatMessageDto from(ChatMessage msg) {
        var member = msg.getChatRoomMember();
        return new ChatMessageDto(msg.getId(),
                msg.getChatRoomMember().getId(),
                member.getChatRoom().getPublicId(),
                member.getUser().getNickname(),
                member.getUser().getFullName(),
                msg.getContent(),
                msg.getSentAt(),
                msg.getMessageStatus());
    }


}
