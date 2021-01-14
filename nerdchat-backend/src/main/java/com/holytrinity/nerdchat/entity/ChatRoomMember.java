package com.holytrinity.nerdchat.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

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
    private UUID id;
    @ManyToOne
    @JoinColumn(name = "chatRoomId")
    private ChatRoom chatRoom;
    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;
    @OneToMany(mappedBy = "chatRoomMember")
    private List<ChatMessage> messages;
    @CreationTimestamp
    private Date lastRead;
}
