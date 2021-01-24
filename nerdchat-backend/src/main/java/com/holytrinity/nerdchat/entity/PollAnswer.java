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
@Table(name = "poll_answers")
public class PollAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String answerText;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "poll_id", nullable = false, foreignKey = @ForeignKey(name = "answers_polls_fk"))
    private Poll poll;

    @OneToMany(fetch=FetchType.LAZY, mappedBy = "answer", cascade = CascadeType.PERSIST)
    private List<PollVote> votes;

}
