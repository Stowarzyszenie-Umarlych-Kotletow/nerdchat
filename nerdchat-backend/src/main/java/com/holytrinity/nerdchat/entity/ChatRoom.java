package com.holytrinity.nerdchat.entity;

import com.holytrinity.nerdchat.model.ChatRoomListEntry;
import com.holytrinity.nerdchat.model.ChatRoomType;
import com.holytrinity.nerdchat.model.MemberPermissions;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "chat_rooms")
@SqlResultSetMapping(name = "ChatRoomListEntries", classes = {
        @ConstructorResult(targetClass = ChatRoomListEntry.class,  columns = {
                @ColumnResult(name = "public_id", type=String.class),
                @ColumnResult(name = "chat_name", type = String.class),
                @ColumnResult(name = "type", type = String.class),
                @ColumnResult(name = "permissions", type = String.class),
                @ColumnResult(name = "unread", type = BigDecimal.class),
                @ColumnResult(name = "join_code", type = String.class),
                @ColumnResult(name = "msg_id", type = BigDecimal.class),
                @ColumnResult(name = "msg_content", type=String.class),
                @ColumnResult(name = "msg_sent_at", type=Date.class),
                @ColumnResult(name = "msg_nickname", type=String.class),
                @ColumnResult(name = "msg_name", type=String.class),
                @ColumnResult(name = "msg_avatar_id", type=BigDecimal.class)
        })
})
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "public_id", length = 16, unique = true)
    @Builder.Default private UUID publicId = UUID.randomUUID();

    @Enumerated(EnumType.STRING)
    private ChatRoomType type;

    private String customDisplayName;

    @OneToMany(mappedBy = "chatRoom")
    private List<ChatRoomMember> members;

    @OneToOne(mappedBy = "chatRoom", optional = true, cascade = CascadeType.PERSIST, fetch = FetchType.EAGER)
    private ChatRoomGroupData groupData;

}
