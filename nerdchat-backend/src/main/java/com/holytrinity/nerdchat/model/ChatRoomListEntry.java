package com.holytrinity.nerdchat.model;

import lombok.Data;

import javax.xml.bind.DatatypeConverter;
import java.io.Serializable;
import java.math.BigDecimal;
import java.nio.ByteBuffer;
import java.util.Date;
import java.util.UUID;

@Data


public class ChatRoomListEntry implements Serializable {
    private BasicChatMessageDto lastMessage;
    private String chatName;
    private UUID chatRoomId;
    private String chatRoomType;
    private String permissions;
    private long unreadCount;
    private String joinCode;
    private int avatarId;


    public ChatRoomListEntry() {
    }


    public ChatRoomListEntry(String public_id, String chat_name, String type, String permissions, BigDecimal unread, String join_code,
                             BigDecimal msg_id, String msg_content, Date msg_sent_at, String msg_nickname, String msg_name, BigDecimal msg_avatar_id) {
        var bb = ByteBuffer.wrap(DatatypeConverter.parseHexBinary(public_id));
        chatRoomId = new UUID(bb.getLong(), bb.getLong());
        chatName = chat_name;
        chatRoomType = type;
        this.permissions = permissions;
        unreadCount = unread.longValue();
        joinCode = join_code;
        lastMessage = new BasicChatMessageDto(
                msg_id.intValue(), 0, msg_nickname, msg_name, msg_content, msg_sent_at
        );
        avatarId = msg_avatar_id.intValue();
    }

}
