package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.ChatMessageReaction;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageReactionRepository extends CrudRepository<ChatMessageReaction, Integer> {

    @Modifying(flushAutomatically = true)
    @Query("DELETE FROM ChatMessageReaction r WHERE r.chatRoomMember.id=?1 AND r.chatMessage.id=?2")
    int unreact(int memberId, int messageId);
}
