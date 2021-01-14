package com.holytrinity.nerdchat.service;

import com.holytrinity.nerdchat.entity.ChatRoom;
import com.holytrinity.nerdchat.entity.ChatRoomMember;
import com.holytrinity.nerdchat.entity.User;
import com.holytrinity.nerdchat.model.BasicChatMessageDto;
import com.holytrinity.nerdchat.model.ChatRoomListEntry;
import com.holytrinity.nerdchat.model.ChatRoomType;
import com.holytrinity.nerdchat.model.rooms.CreateDirectChatResult;
import com.holytrinity.nerdchat.repository.ChatMessageRepository;
import com.holytrinity.nerdchat.repository.ChatRoomMemberRepository;
import com.holytrinity.nerdchat.repository.ChatRoomRepository;
import com.holytrinity.nerdchat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import javax.persistence.Tuple;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChatRoomService {
    @Autowired private UserService _users;
    @Autowired private ChatMessageRepository _msgRepository;
    @Autowired private ChatRoomRepository _roomRepository;
    @Autowired private ChatRoomMemberRepository _memberRepository;


    public String getChatRoomName(ChatRoom room, UUID userId) {
        if(room.getType() != ChatRoomType.DIRECT)
            return room.getCustomDisplayName();
        return _memberRepository.findFirstByChatRoom_IdAndUser_idNot(room.getId(), userId)
                .map(x -> x.getUser().getFirstName() + " " + x.getUser().getLastName())
                .orElse("Yourself");
    }

    public void setLastRead(ChatRoomMember member) {
        member.setLastRead(new Date());
        _memberRepository.save(member);
    }

    public List<ChatRoomListEntry> getUserChatRoomList(UUID userId) {
        return _memberRepository.findByUser_id(userId).stream()
                .sorted(Comparator.comparing(ChatRoomMember::getLastRead).reversed())
                .map(x -> {
                    var m = _msgRepository.findLastInChatRoom(x.getChatRoom().getId());
                    return new ChatRoomListEntry(
                            m.map(BasicChatMessageDto::from).orElseGet(() -> BasicChatMessageDto.builder().content("").sentAt(x.getLastRead()).build()),
                            getChatRoomName(x.getChatRoom(), userId),
                            x.getChatRoom().getId(),
                            _msgRepository.countByChatRoom_idAndSentAtAfter(x.getChatRoom().getId(), x.getLastRead())
                    );
                })
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

    public ChatRoom createDirectChat(User u1, User u2) {
        var users = u1.getId() == u2.getId() ? List.of(u1) : List.of(u1, u2);
        var room = _roomRepository.save(
                ChatRoom.builder().type(ChatRoomType.DIRECT).build()
        );
        var members = users.stream().map(u -> ChatRoomMember.builder().user(u).chatRoom(room).build()).collect(Collectors.toList());
        _memberRepository.saveAll(members);
        room.setMembers(members);
        return room;
    }

    public Pair<CreateDirectChatResult, Optional<ChatRoom>> createDirectChatByNickname(User user, String nickname) {

        try {
            var target = _users.findByNickname(nickname).orElseThrow();
            var existing = _roomRepository.findExistingChatRoomBetween(user.getId(), target.getId());
            var isNew = existing.isEmpty();
            var room = existing.orElseGet(() -> createDirectChat(user, target));
            return Pair.of(new CreateDirectChatResult(room.getId(), isNew), isNew ? Optional.of(room) : Optional.empty());

        }catch (Exception e) {

        }
        return Pair.of(new CreateDirectChatResult(), Optional.empty());
    }
}
