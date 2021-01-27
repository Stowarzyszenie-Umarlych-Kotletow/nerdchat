package com.holytrinity.nerdchat.entity;

import lombok.*;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "polls")
public class Poll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int id;

    public String questionText;
    public boolean isMultichoice;

    public Date createdAt;
    public Date expiresAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id", foreignKey = @ForeignKey(name = "polls_users_fk"))
    private User author;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "messagePoll")
    private List<ChatMessage> chatMessages;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "poll", cascade = CascadeType.PERSIST)
    private List<PollAnswer> answers;


}
