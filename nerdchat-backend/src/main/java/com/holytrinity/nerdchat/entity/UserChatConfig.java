package com.holytrinity.nerdchat.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user_configs")
public class UserChatConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "configs_users_fk"))
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
    @Column(precision = 4)
    private int randomSeed;
    private boolean showNotifications;

}
