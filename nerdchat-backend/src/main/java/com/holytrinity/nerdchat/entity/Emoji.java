package com.holytrinity.nerdchat.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;

import javax.persistence.*;
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
    @Column(unique = true)
    private String label;
    @Column(unique = true)
    private String dataText;

    public Emoji(String label, String data) {
        this.label = label;
        this.dataText = data;
    }

    @OneToMany(mappedBy = "emoji")
    private List<ChatMessageReaction> reactions;
}
