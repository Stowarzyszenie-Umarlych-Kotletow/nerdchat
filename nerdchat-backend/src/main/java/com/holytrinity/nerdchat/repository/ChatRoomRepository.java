package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.ChatRoom;
import com.holytrinity.nerdchat.model.ChatRoomListEntry;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public interface ChatRoomRepository extends CrudRepository<ChatRoom, Integer> {
    @Query("SELECT room FROM ChatRoom room " +
            "INNER JOIN ChatRoomMember m1 ON (m1.chatRoom.id=room.id AND m1.user.id=?1) " +
            "INNER JOIN ChatRoomMember m2 ON (m2.chatRoom.id=room.id AND m2.user.id=?2) " +
            "WHERE room.type=0")
    Optional<ChatRoom> _findExistingChatRoomBetween(int userId1, int userId2);
    @Query("SELECT room FROM ChatRoom room " +
            "INNER JOIN ChatRoomGroupData g ON (g.chatRoom.id=room.id)" +
            "WHERE room.type=1 AND g.joinCode IS NOT NULL AND LOWER(g.joinCode)=?1")
    Optional<ChatRoom> _findChatRoomByCode(String code);
    Optional<ChatRoom> findByPublicId(UUID publicId);
    default Optional<ChatRoom> findChatRoomByCode(String code) {
        return _findChatRoomByCode(code.toLowerCase());
    }
    default Optional<ChatRoom> findExistingChatRoomBetween(int userId1, int userId2) {
        return _findExistingChatRoomBetween(userId1, userId2);
    }

    @Procedure(value = "GET_USER_ROOM_DATA")
    List<ChatRoomListEntry> getShitOn(int user_id);
}
