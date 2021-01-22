package com.holytrinity.nerdchat.service;

import com.holytrinity.nerdchat.entity.ChatMessage;
import com.holytrinity.nerdchat.model.ChatMessageStatus;
import com.holytrinity.nerdchat.repository.ChatMessageRepository;
import com.holytrinity.nerdchat.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ChatMessageService {
    @Autowired private ChatMessageRepository _msgRepository;
    @Autowired private ChatRoomRepository _roomRepository;

    public ChatMessage save(ChatMessage msg){
        if(msg.getMessageStatus() == null || msg.getMessageStatus() == ChatMessageStatus.SENDING)
            msg.setMessageStatus(ChatMessageStatus.SENT);
        _msgRepository.save(msg);
        return msg;
    }

    public List<ChatMessage> findByChatRoomId(int chatRoomId, Sort sort) {
        return _msgRepository.findByChatRoom_id(chatRoomId, sort);
    }

    public List<ChatMessage> findByChatRoomId(UUID chatRoomId, Sort sort) {
        return _msgRepository.findByChatRoom_publicId(chatRoomId, sort);
    }

    public Optional<ChatMessage> findById(int id) {
        return _msgRepository.findById(id);
    }
}
