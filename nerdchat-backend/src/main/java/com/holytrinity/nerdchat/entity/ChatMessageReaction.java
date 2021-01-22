package com.holytrinity.nerdchat.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ChatMessageReaction {
    @Id
    @GeneratedValue
    public int id;
    @ManyToOne(fetch = FetchType.LAZY)
    private ChatRoomMember chatRoomMember;
    @ManyToOne(fetch = FetchType.LAZY)
    private ChatMessage chatMessage;
    @ManyToOne(fetch = FetchType.EAGER)
    private Emoji emoji;
}
