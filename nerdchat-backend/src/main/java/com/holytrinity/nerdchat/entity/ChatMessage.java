package com.holytrinity.nerdchat.entity;

import com.holytrinity.nerdchat.model.ChatMessageStatus;
import com.holytrinity.nerdchat.model.ChatRoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.ManyToAny;

import javax.persistence.*;
import java.util.Date;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ChatMessage {
    @Id
    @GeneratedValue
    private int id;

    private String content;
    @CreationTimestamp
    private Date sentAt;
    private ChatMessageStatus messageStatus;
    @ManyToOne(fetch = FetchType.LAZY)
    private ChatRoom chatRoom;
    @ManyToOne(fetch = FetchType.LAZY)
    private ChatRoomMember chatRoomMember;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.PERSIST, mappedBy = "chatMessage")
    private ChatMessagePoll poll;

}
