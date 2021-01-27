package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.ChatMessage;
import com.holytrinity.nerdchat.model.BasicChatMessageDto;
import com.holytrinity.nerdchat.model.ChatMessageDto;
import com.holytrinity.nerdchat.model.ChatMessageStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatMessageRepository
        extends PagingAndSortingRepository<ChatMessage, Integer> {

    List<ChatMessage> findByChatRoomMember_ChatRoom_id(int chatRoomId, Sort sort);
    @Query("SELECT new com.holytrinity.nerdchat.model.BasicChatMessageDto(msg.id, me.id, u.nickname, u.firstName, u.lastName, msg.content, msg.sentAt) " +
            "FROM ChatRoom room " +
            "INNER JOIN ChatRoomMember me ON (room.id=me.chatRoom.id) " +
            "INNER JOIN User u ON (u.id=me.user.id) " +
            "INNER JOIN ChatMessage msg ON (me.id=msg.chatRoomMember.id)" +
            "WHERE room.publicId=?1 ORDER BY msg.sentAt ASC")
    List<BasicChatMessageDto> findMessagesInChatRoom(UUID chatRoomId);
    Optional<ChatMessage> findFirstByChatRoomMember_ChatRoom_id(int chatRoomId, Sort sort);

}
