package com.holytrinity.nerdchat.entity;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "message_reactions")
public class ChatMessageReaction implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", foreignKey = @ForeignKey(name = "reactions_members_fk"))
    private ChatRoomMember chatRoomMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id", foreignKey = @ForeignKey(name = "reactions_messages_fk"))
    private ChatMessage chatMessage;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "emoji_id", foreignKey = @ForeignKey(name = "reactions_emojis_fk"))
    private Emoji emoji;
}
