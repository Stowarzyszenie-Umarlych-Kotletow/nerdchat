package com.holytrinity.nerdchat.model;

import com.holytrinity.nerdchat.entity.ChatMessage;
import com.holytrinity.nerdchat.entity.ChatRoomMember;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class ChatRoomListEntry {
    public BasicChatMessageDto lastMessage;
    public String chatName;
    public UUID chatRoomId;
    public ChatRoomType chatRoomType;
    public MemberPermissions permissions;
    public long unreadCount;

}
