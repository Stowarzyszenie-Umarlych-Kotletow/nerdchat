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
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true)
    private String nickname;
    private String firstName;
    private String lastName;

    @OneToMany(mappedBy = "user")
    private List<ChatRoomMember> chats;

    public String getFullName() {
        return getFirstName() + " " + getLastName();
    }

}
