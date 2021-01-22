package com.holytrinity.nerdchat.entity;

import com.holytrinity.nerdchat.model.MemberPermissions;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.boot.context.properties.bind.DefaultValue;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ChatRoomMember {
    @Id
    @GeneratedValue
    private int id;
    @ManyToOne
    @JoinColumn(name = "chatRoomId")
    private ChatRoom chatRoom;
    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;
    @OneToMany(mappedBy = "chatRoomMember")
    private List<ChatMessage> messages;
    @OneToMany(mappedBy = "chatRoomMember")
    private List<ChatMessageReaction> reactions;

    @CreationTimestamp
    private Date lastRead;
    private MemberPermissions permissions;
}
