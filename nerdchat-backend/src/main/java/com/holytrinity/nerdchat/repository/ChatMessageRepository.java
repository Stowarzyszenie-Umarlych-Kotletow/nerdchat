package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.ChatMessage;
import com.holytrinity.nerdchat.model.ChatMessageDto;
import com.holytrinity.nerdchat.model.ReactionCountDto;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatMessageRepository
        extends PagingAndSortingRepository<ChatMessage, Integer> {

    List<ChatMessage> findByChatRoomMember_ChatRoom_id(int chatRoomId, Sort sort);

    @Query("SELECT new com.holytrinity.nerdchat.model.ChatMessageDto(msg.id, me.id, u.nickname, u.firstName, u.lastName, msg.content, msg.sentAt, file, atm.id) " +
            "FROM ChatRoom room " +
            "INNER JOIN ChatRoomMember me ON (room.id=me.chatRoom.id) " +
            "INNER JOIN User u ON (u.id=me.user.id) " +
            "INNER JOIN ChatMessage msg ON (me.id=msg.chatRoomMember.id)" +
            "LEFT JOIN ChatMessageAttachment atm ON (atm.message.id=msg.id)" +
            "LEFT JOIN UploadedFile file ON (file.id=atm.file.id) " +
            "WHERE room.publicId=?1 ORDER BY msg.sentAt ASC")
    List<ChatMessageDto> findMessagesInChatRoom(UUID chatRoomId);

    Optional<ChatMessage> findFirstByChatRoomMember_ChatRoom_id(int chatRoomId, Sort sort);

    @Query("SELECT new com.holytrinity.nerdchat.model.ReactionCountDto(" +
            "msg.id, r.emoji.id, COUNT(r.id), MAX(CASE WHEN rMe.user.id=?2 THEN 1 ELSE 0 END)) " +
            "FROM ChatRoom room " +
            "INNER JOIN ChatRoomMember me ON(room.id=me.chatRoom.id) " +
            "INNER JOIN ChatMessage msg ON (me.id=msg.chatRoomMember.id) " +
            "INNER JOIN ChatMessageReaction r ON(msg.id=r.chatMessage.id) " +
            "INNER JOIN ChatRoomMember rMe ON(rMe.id=r.chatRoomMember.id) " +
            "WHERE room.publicId=?1 AND msg.sentAt BETWEEN ?3 AND ?4 " +
            "GROUP BY msg.id, r.emoji.id")
    List<ReactionCountDto> findReactionsInChatRoom(UUID chatRoomId, int userId, Date from, Date until);

    @Query("SELECT new com.holytrinity.nerdchat.model.ReactionCountDto(msg.id, r.emoji.id, COUNT(r.id), MAX(CASE WHEN r.chatRoomMember.id=?2 THEN 1 ELSE 0 END)) " +
            "FROM ChatMessage msg " +
            "INNER JOIN ChatMessageReaction r ON(msg.id=r.chatMessage.id) " +
            "WHERE msg.id=?1 " +
            "GROUP BY msg.id, r.emoji.id")
    List<ReactionCountDto> findMessageReactions(int messageId, int memberId);

    @Modifying(flushAutomatically = true)
    @Procedure("REACT_TO_MESSAGE")
    void reactToMessage(int p_member_id, int p_msg_id, int p_em_id);

}
