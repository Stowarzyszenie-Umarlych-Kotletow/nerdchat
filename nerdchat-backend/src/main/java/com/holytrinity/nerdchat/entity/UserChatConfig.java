package com.holytrinity.nerdchat.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class UserChatConfig {
    @Id
    @GeneratedValue
    private int id;
    @OneToOne
    @JoinColumn(name = "userId")
    private User user;
    @Column(length = 7)
    private String textColorMain;
    @Column(length = 7)
    private String textColorUser;
    @Column(length = 7)
    private String accentsColor;
    @Column(length = 7)
    private String backgroundColor;
    @Column(precision = 3)
    private float fontSizeMultiplier;
    private boolean showNotifications;

}
