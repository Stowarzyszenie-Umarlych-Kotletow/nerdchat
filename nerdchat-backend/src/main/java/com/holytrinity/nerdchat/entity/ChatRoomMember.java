package com.holytrinity.nerdchat.entity;

import com.holytrinity.nerdchat.model.MemberPermissions;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "room_members")
public class ChatRoomMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name = "room_id", foreignKey = @ForeignKey(name = "members_rooms_fk"))
    private ChatRoom chatRoom;
    @ManyToOne
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "members_users_fk"))
    private User user;
    @OneToMany(mappedBy = "chatRoomMember")
    private List<ChatMessage> messages;
    @OneToMany(mappedBy = "chatRoomMember")
    private List<ChatMessageReaction> reactions;

    //@CreationTimestamp
    private Date lastRead;
    //@CreationTimestamp
    private Date joinedAt;
    private Date leftAt;

    @Enumerated(EnumType.STRING)
    private MemberPermissions permissions;
}
