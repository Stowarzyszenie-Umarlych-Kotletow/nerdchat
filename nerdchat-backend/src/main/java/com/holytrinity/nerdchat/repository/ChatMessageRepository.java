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

    List<ChatMessage> findByChatRoom_id(int chatRoomId, Sort sort);
    List<ChatMessage> findByChatRoom_publicId(UUID chatRoomId, Sort sort);
    Optional<ChatMessage> findFirstByChatRoom_id(int chatRoomId, Sort sort);
    long countByChatRoom_idAndSentAtAfter(int chatRoomId, Date sentAfter);

    default Optional<ChatMessage> findLastInChatRoom(int chatRoomId) {
        return findFirstByChatRoom_id(chatRoomId, Sort.by("sentAt").descending());
    }
}
