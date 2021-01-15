package com.holytrinity.nerdchat.controller;

import com.holytrinity.nerdchat.entity.ChatMessage;
import com.holytrinity.nerdchat.entity.ChatRoom;
import com.holytrinity.nerdchat.entity.User;
import com.holytrinity.nerdchat.model.*;
import com.holytrinity.nerdchat.model.stomp.EditRoomCodeRequest;
import com.holytrinity.nerdchat.model.stomp.NotifyChannelJoinCode;
import com.holytrinity.nerdchat.repository.ChatRoomMemberRepository;
import com.holytrinity.nerdchat.repository.UserRepository;
import com.holytrinity.nerdchat.service.ChatMessageService;
import com.holytrinity.nerdchat.service.ChatRoomService;
import com.holytrinity.nerdchat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate messaging;
    @Autowired
    private ChatMessageService messageService;
    @Autowired
    private ChatRoomService roomService;
    @Autowired
    private ChatRoomMemberRepository roomMemberRepository;
    @Autowired
    private UserService userService;

    @MessageMapping("/send-chat")
    public void sendChat(SimpMessageHeaderAccessor h, @Payload SendChatMessage msg) throws Exception {
        var usrId = _getUserId(h);
        msg.setSenderId(usrId);
        var chat = roomService.findById(msg.getChannelId());
        var member = roomService.getRoomMember(msg.getChannelId(), msg.getSenderId(), false);
        if (chat.isEmpty() || member.isEmpty())
            return;
        var message = messageService.save(ChatMessage.builder()
                .chatRoom(member.get().getChatRoom())
                .chatRoomMember(member.get())
                .content(msg.getContent())
                .sentAt(new Date())
                .build());

        var notification = BasicChatMessageDto.from(message);
        _notifyUpdatedChannel(message.getChatRoom().getId(), "message", notification);
    }

    @MessageMapping("/last-read")
    public void setLastRead(SimpMessageHeaderAccessor h, @Payload SetLastRead msg) {
        var usrId = _getUserId(h);
        var member = roomService.getRoomMember(msg.getChannelId(), usrId, false);
        if (member.isEmpty())
            return;
        var m = member.get();
        roomService.setLastRead(m);

        messaging.convertAndSendToUser(
                usrId.toString().toLowerCase(),
                "/queue/last-read",
                new SetLastReadResponse(msg.getChannelId(), m.getLastRead())
        );
    }

    private <T> T _reply(SimpMessageHeaderAccessor h, T obj) {
        messaging.convertAndSendToUser(
                _getUserId(h).toString().toLowerCase(),
                "/queue/r",
                obj, new HashMap<>() {{
                    put("r", h.getFirstNativeHeader("r"));
                }});
        return obj;
    }

    private <T> void _notifyUpdated(UUID uid, String type, T obj) {
        messaging.convertAndSendToUser(
                uid.toString().toLowerCase(),
                "/queue/notify-updated",
                obj, new HashMap<>() {{
                    put("type", type);
                }});
    }

    private <T> void _notifyUpdatedChannel(UUID channel, String type, T obj) {
        messaging.convertAndSend("/topic/channel/notify/" + channel.toString().toLowerCase(), obj, new HashMap<>() {{
            put("type", type);
        }});
    }

    private Optional<User> _getUser(SimpMessageHeaderAccessor h) throws Exception {
        return userService.findById(_getUserId(h));
    }

    private UUID _getUserId(SimpMessageHeaderAccessor h) {
        var str = h.getUser();
        if (str == null)
            return null;
        return ((UserClaim) str).getId();
    }


    @MessageMapping("/create-room/direct")
    public void createRoomDirect(SimpMessageHeaderAccessor h, @Payload String nickname) throws Exception {
        var user = _getUser(h);
        user.ifPresent(value -> {
            var res = roomService.createDirectChatByNickname(value, nickname);
            res.getSecond().ifPresent(room -> {
                for (var member : room.getMembers())
                    _notifyUpdated(member.getUser().getId(), "new-room", room.getId());
            });

            _reply(h, res.getFirst());
        });
    }

    @MessageMapping("/create-room/group")
    public void createRoomGroup(SimpMessageHeaderAccessor h, @Payload String groupName) throws Exception {
        var user = _getUser(h);
        user.ifPresent(value -> {
            var res = roomService.createGroupChat(value, groupName);
            res.getSecond().ifPresent(room -> {
                for (var member : room.getMembers())
                    _notifyUpdated(member.getUser().getId(), "new-room", room.getId());
            });

            _reply(h, res.getFirst());
        });
    }

    @MessageMapping("/join-room/code")
    public void joinRoomByCode(SimpMessageHeaderAccessor h, @Payload String code) throws Exception {
        var user = _getUser(h);
        user.ifPresent(value -> {
            var res = roomService.joinChatByCode(value, code);
            if (res.isNew()) {
                _notifyUpdated(value.getId(), "new-room", res.getChatRoomId());
            }
            _reply(h, res);
        });
    }

    @MessageMapping("/manage-room/code")
    public void editRoomCode(SimpMessageHeaderAccessor h, @Payload EditRoomCodeRequest model) throws Exception {
        var user = _getUser(h);
        if (user.isEmpty())
            return;
        var usr = user.get();
        var member = roomService.getRoomMember(model.getChatRoomId(), usr, false);
        if (member.isEmpty() || member.get().getPermissions() != MemberPermissions.ADMIN) {
            _reply(h, "No permissions");
            return;
        }
        String code = null;
        try {
            code = roomService.setChatroomCode(model.getChatRoomId(), model.getJoinCode());
        } catch (MessagingException ex) {
            _reply(h, ex.getMessage());
            return;
        }
        _notifyUpdatedChannel(model.getChatRoomId(), "joincode", new NotifyChannelJoinCode(model.getChatRoomId(), code));
    }


}
