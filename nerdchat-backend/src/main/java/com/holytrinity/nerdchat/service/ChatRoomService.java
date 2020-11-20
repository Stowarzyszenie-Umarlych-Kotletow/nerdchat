package com.holytrinity.nerdchat.service;

import com.holytrinity.nerdchat.entity.ChatRoom;
import com.holytrinity.nerdchat.entity.ChatRoomMember;
import com.holytrinity.nerdchat.entity.User;
import com.holytrinity.nerdchat.model.BasicChatMessageDto;
import com.holytrinity.nerdchat.model.ChatRoomListEntry;
import com.holytrinity.nerdchat.model.ChatRoomType;
import com.holytrinity.nerdchat.repository.ChatMessageRepository;
import com.holytrinity.nerdchat.repository.ChatRoomMemberRepository;
import com.holytrinity.nerdchat.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import javax.persistence.Tuple;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatRoomService {
    @Autowired private ChatMessageRepository _msgRepository;
    @Autowired private ChatRoomRepository _roomRepository;
    @Autowired private ChatRoomMemberRepository _memberRepository;


    public String getChatRoomName(ChatRoom room, UUID userId) {
        if(room.getType() != ChatRoomType.DIRECT)
            return room.getCustomDisplayName();
        return _memberRepository.findFirstByChatRoom_IdAndUser_idNot(room.getId(), userId)
                .map(x -> x.getUser().getFirstName() + " " + x.getUser().getLastName())
                .orElse("Unnamed");
    }

    public List<ChatRoomListEntry> getUserChatRoomList(UUID userId) {
        return _memberRepository.findByUser_id(userId).stream()
                .sorted(Comparator.comparing(ChatRoomMember::getLastRead).reversed())
                .map(x ->
                    _msgRepository.findLastInChatRoom(x.getChatRoom().getId()).map(
                            m -> new ChatRoomListEntry(BasicChatMessageDto.from(m), getChatRoomName(m.getChatRoom(), userId)))
                            .orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public Optional<ChatRoom> findById(UUID roomId) {
        return _roomRepository.findById(roomId);
    }

    public Optional<ChatRoomMember> findRoomMember(UUID roomId, UUID userId) {
        return _memberRepository.findFirstByChatRoom_IdAndUser_id(roomId, userId);
    }


    public Optional<ChatRoomMember> getRoomMember(UUID roomId, User user, boolean create) {
        return findRoomMember(roomId, user.getId())
                .or(() -> {
                    if(!create)
                        return Optional.empty();
                    return Optional.of(_memberRepository.save(
                            ChatRoomMember.builder()
                                    .chatRoom(ChatRoom.builder().id(roomId).build())
                                    .user(user)
                                    .build()
                    ));
                });
    }
    public Optional<ChatRoomMember> getRoomMember(UUID roomId, UUID userId, boolean create) {
        return getRoomMember(roomId, User.builder().id(userId).build(), create);

    }

    public Pair<ChatRoomMember, ChatRoomMember> addToRoom(UUID roomId, User userA, User userB) {
        return Pair.of(getRoomMember(roomId, userA, true).orElseThrow(),
                getRoomMember(roomId, userB, true).orElseThrow());
    }
}
