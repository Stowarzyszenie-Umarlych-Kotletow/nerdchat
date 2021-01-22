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
public class ChatMessagePollVote implements Serializable {
    @Id
    @Column(name = "voterId")
    private int voterId;
    @Id
    @Column(name = "answerId")
    private int answerId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "voterId", nullable = false)
    private ChatRoomMember voter;



    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "answerId", nullable = false)
    private ChatMessagePollAnswer answer;



}
