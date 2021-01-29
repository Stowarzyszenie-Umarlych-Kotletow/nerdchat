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
@Table(name = "emojis")
public class Emoji {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(unique = true, length = 32)
    private String label;
    @Column(unique = true, columnDefinition = "NVARCHAR(8)")
    private String dataText;
    @OneToMany(mappedBy = "emoji")
    private List<ChatMessageReaction> reactions;

    public Emoji(String label, String data) {
        this.label = label;
        this.dataText = data;
    }
}
