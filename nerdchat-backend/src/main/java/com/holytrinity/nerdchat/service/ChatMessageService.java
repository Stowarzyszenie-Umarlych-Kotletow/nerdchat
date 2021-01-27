package com.holytrinity.nerdchat.service;

import com.holytrinity.nerdchat.entity.ChatMessage;
import com.holytrinity.nerdchat.entity.ChatMessageAttachment;
import com.holytrinity.nerdchat.entity.UploadedFile;
import com.holytrinity.nerdchat.model.BasicChatMessageDto;
import com.holytrinity.nerdchat.model.ChatMessageDto;
import com.holytrinity.nerdchat.model.ChatMessageStatus;
import com.holytrinity.nerdchat.repository.ChatMessageRepository;
import com.holytrinity.nerdchat.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ChatMessageService {
    @Autowired private ChatMessageRepository _msgRepository;
    @Autowired private ChatRoomRepository _roomRepository;
    @Autowired private EntityManager entities;

    public ChatMessage save(ChatMessage msg){
        if(msg.getMessageStatus() == null || msg.getMessageStatus() == ChatMessageStatus.SENDING)
            msg.setMessageStatus(ChatMessageStatus.SENT);
        _msgRepository.save(msg);
        return msg;
    }

    public List<ChatMessage> findByChatRoomId(int chatRoomId, Sort sort) {
        return _msgRepository.findByChatRoomMember_ChatRoom_id(chatRoomId, sort);
    }

    public List<ChatMessageDto> findByChatRoomId(UUID chatRoomId) {
        return _msgRepository.findMessagesInChatRoom(chatRoomId);
    }

    public Optional<ChatMessage> findById(int id) {
        return _msgRepository.findById(id);
    }

    public Pair<ChatMessage, Optional<ChatMessageAttachment>> create(ChatMessage.ChatMessageBuilder b, Integer fileId) {
        var msg = b.build();
        ChatMessageAttachment atm = null;
        if (fileId != null) {
           var attachment = ChatMessageAttachment .builder().message(msg)
                   .file(UploadedFile.builder().id(fileId).build()).build();
           entities.persist(attachment);
           atm = attachment;
        }
        return Pair.of(save(msg), Optional.ofNullable(atm));
    }
}
