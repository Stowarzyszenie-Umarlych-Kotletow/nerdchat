package com.holytrinity.nerdchat.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.util.Optional;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ChatRoomGroupData {
    @Id
    @GeneratedValue
    private int id;

    @OneToOne(optional = true, fetch = FetchType.LAZY)
    private ChatRoom chatRoom;
    @Column(unique = true)
    private String joinCode;

}
