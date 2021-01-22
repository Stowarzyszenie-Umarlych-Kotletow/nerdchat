package com.holytrinity.nerdchat.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ChatMessagePollAnswer {
    @Id
    @GeneratedValue
    private int id;
    private String answerText;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pollId", nullable = false)
    private ChatMessagePoll poll;

    @OneToMany(fetch=FetchType.LAZY, mappedBy = "answer", cascade = CascadeType.PERSIST)
    private List<ChatMessagePollVote> votes;

}
