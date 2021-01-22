package com.holytrinity.nerdchat.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Emoji {
    @Id
    @GeneratedValue
    private int id;
    private String label;
    private String dataText;

    @OneToMany(mappedBy = "emoji")
    private List<ChatMessageReaction> reactions;
}
