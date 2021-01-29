package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.ChatMessageAttachment;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MessageAttachmentRepository extends CrudRepository<ChatMessageAttachment, Integer> {
    Optional<ChatMessageAttachment> findByIdAndMessageId(int id, int messageId);
}
