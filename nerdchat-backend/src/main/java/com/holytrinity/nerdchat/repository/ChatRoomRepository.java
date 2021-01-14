package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.ChatRoom;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public interface ChatRoomRepository extends CrudRepository<ChatRoom, UUID> {
    @Query("SELECT room FROM ChatRoom room " +
            "INNER JOIN ChatRoomMember m1 ON (m1.chatRoom.id=room.id AND m1.user.id=?1) " +
            "INNER JOIN ChatRoomMember m2 ON (m2.chatRoom.id=room.id AND m2.user.id=?2) " +
            "WHERE room.type=0")
    Optional<ChatRoom> _findExistingChatRoomBetween(UUID userId1, UUID userId2);
    @Query("SELECT room FROM ChatRoom room " +
            "INNER JOIN ChatRoomGroupData g ON (g.chatRoom.id=room.id)" +
            "WHERE room.type=1 AND g.joinCode IS NOT NULL AND LOWER(g.joinCode)=?1")
    Optional<ChatRoom> _findChatRoomByCode(String code);
    default Optional<ChatRoom> findChatRoomByCode(String code) {
        return _findChatRoomByCode(code.toLowerCase());
    }
    default Optional<ChatRoom> findExistingChatRoomBetween(UUID userId1, UUID userId2) {
        return _findExistingChatRoomBetween(userId1, userId2);
    }
}
