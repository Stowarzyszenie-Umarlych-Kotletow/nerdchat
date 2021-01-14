package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.ChatRoom;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRoomRepository extends CrudRepository<ChatRoom, UUID> {
    @Query("SELECT room FROM ChatRoom room " +
            "INNER JOIN ChatRoomMember m1 ON (m1.chatRoom.id=room.id AND m1.user.id=?1) " +
            "INNER JOIN ChatRoomMember m2 ON (m2.chatRoom.id=room.id AND m2.user.id=?2) " +
            "WHERE room.type=0")
    Optional<ChatRoom> findExistingChatRoomBetween(UUID userId1, UUID userId2);
}
