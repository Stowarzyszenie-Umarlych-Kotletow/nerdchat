package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.ChatMessage;
import com.holytrinity.nerdchat.model.ChatMessageStatus;
import org.springframework.data.domain.Sort;
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
    List<ChatMessage> findByChatRoomMember_ChatRoom_publicId(UUID chatRoomId, Sort sort);
    Optional<ChatMessage> findFirstByChatRoomMember_ChatRoom_id(int chatRoomId, Sort sort);
    long countByChatRoomMember_ChatRoom_idAndSentAtAfter(int chatRoomId, Date sentAfter);

    default Optional<ChatMessage> findLastInChatRoom(int chatRoomId) {
        return findFirstByChatRoomMember_ChatRoom_id(chatRoomId, Sort.by("sentAt").descending());
    }
}
