package com.holytrinity.nerdchat.service;

import com.holytrinity.nerdchat.entity.ChatRoom;
import com.holytrinity.nerdchat.entity.ChatRoomMember;
import com.holytrinity.nerdchat.entity.User;
import com.holytrinity.nerdchat.model.ChatRoomListEntry;
import com.holytrinity.nerdchat.model.rooms.CreateChatResult;
import com.holytrinity.nerdchat.repository.ChatMessageRepository;
import com.holytrinity.nerdchat.repository.ChatRoomGroupDataRepository;
import com.holytrinity.nerdchat.repository.ChatRoomMemberRepository;
import com.holytrinity.nerdchat.repository.ChatRoomRepository;
import com.holytrinity.nerdchat.utils.TrimUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.messaging.MessagingException;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.ParameterMode;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ChatRoomService {
    @Autowired
    private UserService _users;
    @Autowired
    private ChatMessageRepository _msgRepository;
    @Autowired
    private ChatRoomRepository _roomRepository;
    @Autowired
    private ChatRoomMemberRepository _memberRepository;
    @Autowired
    private ChatRoomGroupDataRepository _groupRepository;
    @Autowired
    private EntityManager _entity;

    public void setLastRead(ChatRoomMember member) {
        member.setLastRead(new Date());
        _memberRepository.save(member);
    }

    public Optional<ChatRoom> findById(int roomId) {
        return _roomRepository.findById(roomId);
    }

    public Optional<ChatRoom> findById(UUID roomId) {
        return _roomRepository.findByPublicId(roomId);
    }

    public Optional<ChatRoomMember> findRoomMember(int roomId, int userId) {
        return _memberRepository.findFirstByChatRoom_IdAndUser_id(roomId, userId);
    }

    public Optional<ChatRoomMember> findRoomMember(UUID roomId, int userId) {
        return _memberRepository.findFirstByChatRoom_PublicIdAndUser_id(roomId, userId);
    }


    public Integer createDirectChat(User u1, User u2) {
        var id = _roomRepository.createDirectChat(u1.getId(), u2.getId());
        return id;
    }

    public Pair<CreateChatResult, Optional<ChatRoom>> createDirectChatByNickname(User user, String nickname) {

        try {
            var target = _users.findByNickname(nickname).orElseThrow();
            if (target.getId() == user.getId())
                throw new Exception("Can't add yourself");
            var existing = _roomRepository.findExistingChatRoomBetween(user.getId(), target.getId());
            var isNew = existing.isEmpty();
            var room = existing.orElseGet(() -> _roomRepository.findById(createDirectChat(user, target)).orElseThrow());
            return Pair.of(new CreateChatResult(room.getPublicId(), isNew), isNew ? Optional.of(room) : Optional.empty());

        } catch (Exception e) {

        }
        return Pair.of(new CreateChatResult(), Optional.empty());
    }

    public Pair<CreateChatResult, Optional<ChatRoom>> createGroupChat(User user, String groupName) {
        var id = _roomRepository.createGroupChat(user.getId(), groupName);
        var room = _roomRepository.findById(id).orElseThrow();
        return Pair.of(new CreateChatResult(room.getPublicId(), true), Optional.of(room));
    }

    public Integer joinChat(int userId, int roomId) {
        var ret = _roomRepository.joinChat(userId, roomId, "DEFAULT");
        return ret;
    }

    public CreateChatResult joinChatByCode(User user, String code) {
        var room = _roomRepository.findChatRoomByCode(code);
        return room.map(chatRoom ->
                new CreateChatResult(chatRoom.getPublicId(),
                        joinChat(user.getId(), chatRoom.getId()) != 0))
                .orElseGet(CreateChatResult::new);
    }

    public String setChatroomCode(UUID roomId, String code) throws MessagingException {
        code = TrimUtils.sanitize(code);
        var room = _roomRepository.findByPublicId(roomId);
        if (room.isEmpty())
            throw new MessagingException("Room not found");
        if (code.length() < 3)
            throw new MessagingException("Invalid code");
        var group = _groupRepository.findFirstByJoinCode(code);
        if (group.isPresent() && group.get().getChatRoom().getId() != room.get().getId())
            throw new MessagingException("Code in use. Try another one.");
        String finalCode = code;
        room.ifPresent(r -> {
            var data = r.getGroupData();
            data.setJoinCode(finalCode);
            _groupRepository.save(data);
        });
        return code;
    }

    public List<ChatRoomListEntry> getUserChatRoomList(int userId) {

        var query = _entity.createStoredProcedureQuery("GET_USER_ROOM_DATA", "ChatRoomListEntries");
        query.registerStoredProcedureParameter("v_user_id", int.class, ParameterMode.IN);
        query.registerStoredProcedureParameter("out_cur", void.class, ParameterMode.REF_CURSOR);
        query.setParameter("v_user_id", userId);


        var list = query.getResultList();
        return list;
    }

}
