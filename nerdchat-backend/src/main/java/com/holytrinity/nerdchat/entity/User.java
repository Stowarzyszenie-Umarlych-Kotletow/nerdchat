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
public class User {
    @Id
    @GeneratedValue
    private int id;

    @Column(unique = true)
    private String nickname;
    private String firstName;
    private String lastName;

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "user", cascade = CascadeType.PERSIST)
    private UserCredentials credentials;
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "user", cascade = CascadeType.PERSIST)
    private UserChatConfig config;

    @OneToMany(mappedBy = "user")
    private List<ChatRoomMember> chats;
    @OneToMany(mappedBy = "user")
    private List<UserAccessToken> accessTokens;

    public String getFullName() {
        return getFirstName() + " " + getLastName();
    }

    @Override
    public String toString() {
        return getFullName();
    }

}
