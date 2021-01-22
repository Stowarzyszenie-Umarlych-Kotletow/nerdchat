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
public class ChatMessagePoll {
    @Id
    @GeneratedValue
    public int id;
    public String questionText;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chatMessageId", nullable = false)
    private ChatMessage chatMessage;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "poll", cascade = CascadeType.PERSIST)
    private List<ChatMessagePollAnswer> answers;


}
