package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.ChatMessageReaction;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageReactionRepository extends CrudRepository<ChatMessageReaction, Integer> {

    @Modifying(flushAutomatically = true)
    @Query("DELETE FROM ChatMessageReaction r WHERE r.chatRoomMember.id=?1 AND r.chatMessage.id=?2")
    int unreact(int memberId, int messageId);

    @Modifying(flushAutomatically = true)
    @Procedure("REACT_TO_MESSAGE")
    void reactToMessage(int p_member_id, int p_msg_id, int p_em_id);
}
