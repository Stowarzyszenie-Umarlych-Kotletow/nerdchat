package com.holytrinity.nerdchat.entity;

import lombok.*;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true)
    private String nickname;
    private String firstName;
    private String lastName;

    private int avatarId;

    @OneToMany(mappedBy = "user")
    private List<ChatRoomMember> chats;
    @OneToMany(mappedBy = "user", cascade = CascadeType.PERSIST)
    private List<UserAccessToken> accessTokens;

    public String getFullName() {
        return getFirstName() + " " + getLastName();
    }

    @Override
    public String toString() {
        return getFullName();
    }

}
