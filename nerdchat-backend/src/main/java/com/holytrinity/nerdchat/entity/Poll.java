package com.holytrinity.nerdchat.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
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

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id", foreignKey = @ForeignKey(name = "polls_users_fk"))
    private User author;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "messagePoll")
    private List<ChatMessage> chatMessages;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "poll", cascade = CascadeType.PERSIST)
    private List<PollAnswer> answers;


}
