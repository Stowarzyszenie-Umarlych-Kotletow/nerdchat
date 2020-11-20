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
        extends PagingAndSortingRepository<ChatMessage, UUID> {

    List<ChatMessage> findByChatRoom_id(UUID chatRoomId, Sort sort);
    Optional<ChatMessage> findFirstByChatRoom_id(UUID chatRoomId, Sort sort);
    long countBySentAtAfter(Date sentAfter);

    default Optional<ChatMessage> findLastInChatRoom(UUID chatRoomId) {
        return findFirstByChatRoom_id(chatRoomId, Sort.by("sentAt").descending());
    }
}
