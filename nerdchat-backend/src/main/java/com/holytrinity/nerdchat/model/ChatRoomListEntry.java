package com.holytrinity.nerdchat.model;

import com.holytrinity.nerdchat.entity.ChatMessage;
import com.holytrinity.nerdchat.entity.ChatRoom;
import com.holytrinity.nerdchat.entity.ChatRoomMember;
import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.SqlResultSetMapping;
import javax.xml.bind.DatatypeConverter;
import java.io.Serializable;
import java.math.BigDecimal;
import java.nio.ByteBuffer;
import java.sql.Timestamp;
import java.util.Date;
import java.util.UUID;

@Data


public class ChatRoomListEntry implements Serializable {
    public BasicChatMessageDto lastMessage;
    public String chatName;
    public UUID chatRoomId;
    public String chatRoomType;
    public String permissions;
    public long unreadCount;
    public String joinCode;


    public ChatRoomListEntry(){}


    public ChatRoomListEntry(String public_id, String chat_name, String type, String permissions, BigDecimal unread, String join_code,
                             BigDecimal msg_id, String msg_content, Date msg_sent_at, String msg_nickname, String msg_name) {
        var bb = ByteBuffer.wrap(DatatypeConverter.parseHexBinary(public_id));
        chatRoomId = new UUID(bb.getLong(), bb.getLong());
        chatName = chat_name;
        chatRoomType = type;
        this.permissions = permissions;
        unreadCount = unread.longValue();
        joinCode = join_code;
        lastMessage = new BasicChatMessageDto(
          msg_id.intValue(), chatRoomId, 0, msg_nickname, msg_name, msg_content, msg_sent_at
        );
    }

}
