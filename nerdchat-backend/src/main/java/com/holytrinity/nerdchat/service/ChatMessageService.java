package com.holytrinity.nerdchat.service;

import com.holytrinity.nerdchat.entity.ChatMessage;
import com.holytrinity.nerdchat.entity.ChatMessageAttachment;
import com.holytrinity.nerdchat.entity.UploadedFile;
import com.holytrinity.nerdchat.model.ChatMessageDto;
import com.holytrinity.nerdchat.model.ChatMessageStatus;
import com.holytrinity.nerdchat.model.http.ReactionCountSummary;
import com.holytrinity.nerdchat.repository.ChatMessageRepository;
import com.holytrinity.nerdchat.repository.ChatRoomRepository;
import com.holytrinity.nerdchat.repository.MessageReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.*;

@Service
public class ChatMessageService {
    @Autowired
    private ChatMessageRepository _msgRepository;
    @Autowired
    private ChatRoomRepository _roomRepository;
    @Autowired
    private EntityManager entities;
    @Autowired
    private MessageReactionRepository reactions;

    public ChatMessage save(ChatMessage msg) {
        if (msg.getMessageStatus() == null || msg.getMessageStatus() == ChatMessageStatus.SENDING)
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
        var msg = save(b.build());
        ChatMessageAttachment atm = null;
        if (fileId != null) {
            atm = ChatMessageAttachment.builder().message(msg)
                    .file(UploadedFile.builder().id(fileId).build()).build();
            entities.persist(atm);
        }
        return Pair.of(msg, Optional.ofNullable(atm));
    }

    public ReactionCountSummary getChatReactions(UUID roomId, int userId, Date from, Date until) {
        if (from == null) {
            from = new Date(2000 - 1900, Calendar.JANUARY, 1);
        }
        if (until == null) {
            until = new Date(2077 - 1900, Calendar.JANUARY, 1);
        }
        return ReactionCountSummary.from(from, until, _msgRepository.findReactionsInChatRoom(roomId, userId, from, until));
    }

    public ChatMessageRepository getRepo() {
        return _msgRepository;
    }

    public MessageReactionRepository getReactionsRepo() {
        return reactions;
    }

    public int unReactToMessage(int memberId, int messageId) {
        return reactions.unreact(memberId, messageId);
    }

    public void reactToMessage(int memberId, int messageId, int emojiId) {
        reactions.reactToMessage(memberId, messageId, emojiId);
    }
}
