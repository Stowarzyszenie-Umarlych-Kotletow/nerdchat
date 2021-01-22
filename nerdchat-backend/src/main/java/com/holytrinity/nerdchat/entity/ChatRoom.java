package com.holytrinity.nerdchat.entity;

import com.holytrinity.nerdchat.model.ChatRoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(indexes = {@Index(name = "chat_room_public_id_idx", columnList = "publicId")})
public class ChatRoom {
    @Id
    @GeneratedValue
    private int id;

    @Column(unique = true, nullable = false)
    @Builder.Default private UUID publicId = UUID.randomUUID();

    private ChatRoomType type;
    private String customDisplayName;

    @OneToMany(mappedBy = "chatRoom")
    private List<ChatRoomMember> members;
    @OneToMany(mappedBy = "chatRoom")
    private List<ChatMessage> messages;
    @OneToOne(mappedBy = "chatRoom", optional = true, cascade = CascadeType.PERSIST, fetch = FetchType.EAGER)
    private ChatRoomGroupData groupData;

}
