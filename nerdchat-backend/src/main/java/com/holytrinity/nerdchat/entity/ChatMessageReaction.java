package com.holytrinity.nerdchat.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    @Column(name = "member_id")
    private int memberId;

    @Id
    @Column(name = "message_id")
    private int messageId;

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
