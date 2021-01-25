package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.ChatRoom;
import com.holytrinity.nerdchat.model.ChatRoomListEntry;
import com.holytrinity.nerdchat.model.MemberPermissions;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.test.annotation.Commit;

import javax.persistence.StoredProcedureParameter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public interface ChatRoomRepository extends CrudRepository<ChatRoom, Integer> {
    @Query("SELECT room FROM ChatRoom room " +
            "INNER JOIN ChatRoomMember m1 ON (m1.chatRoom.id=room.id AND m1.user.id=?1) " +
            "INNER JOIN ChatRoomMember m2 ON (m2.chatRoom.id=room.id AND m2.user.id=?2) " +
            "WHERE room.type='DIRECT'")
    Optional<ChatRoom> findExistingChatRoomBetween(int userId1, int userId2);

    @Query("SELECT room FROM ChatRoom room " +
            "INNER JOIN ChatRoomGroupData g ON (g.chatRoom.id=room.id)" +
            "WHERE room.type='GROUP' AND g.joinCode IS NOT NULL AND g.joinCode=LOWER(?1)")
    Optional<ChatRoom> findChatRoomByCode(String code);

    Optional<ChatRoom> findByPublicId(UUID publicId);


    @Procedure(value = "JOIN_CHAT", outputParameterName = "out_member_id")
    Integer joinChat(int p_user_id, int p_room_id, String p_perms);


    @Procedure(value = "CREATE_DIRECT_CHAT", outputParameterName = "out_room_id")
    Integer createDirectChat(int p_u1_id, int p_u2_id);

    @Procedure(value = "CREATE_GROUP_CHAT", outputParameterName = "out_room_id")
    Integer createGroupChat(int p_user_id, String p_name);

}
