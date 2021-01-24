package com.holytrinity.nerdchat.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "poll_votes")
public class PollVote implements Serializable {
    @Id
    @Column(name = "voter_id")
    private int voterId;
    @Id
    @Column(name = "answer_id")
    private int answerId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "voter_id", nullable = false, foreignKey = @ForeignKey(name = "votes_users_fk"))
    private User voter;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "answer_id", nullable = false, foreignKey = @ForeignKey(name = "votes_answers_fk"))
    private PollAnswer answer;


}
