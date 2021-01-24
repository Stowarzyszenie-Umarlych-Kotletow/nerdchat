package com.holytrinity.nerdchat.controller;

import com.holytrinity.nerdchat.entity.ChatMessage;
import com.holytrinity.nerdchat.entity.User;
import com.holytrinity.nerdchat.model.*;
import com.holytrinity.nerdchat.model.stomp.EditRoomCodeRequest;
import com.holytrinity.nerdchat.model.stomp.NotifyChannelJoinCode;
import com.holytrinity.nerdchat.repository.ChatRoomMemberRepository;
import com.holytrinity.nerdchat.service.ChatMessageService;
import com.holytrinity.nerdchat.service.ChatRoomService;
import com.holytrinity.nerdchat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;

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
        var member = roomService.findById(msg.getChannelId()).flatMap(m -> roomService.getRoomMember(m.getId(), usrId, false));
        if (member.isEmpty())
            return;
        var message = messageService.save(ChatMessage.builder()
                .chatRoomMember(member.get())
                .content(msg.getContent())
                .sentAt(new Date())
                .build());

        var notification = BasicChatMessageDto.from(message);
        _notifyChannel(member.get().getChatRoom().getPublicId(), "message", notification);
    }

    @MessageMapping("/last-read")
    public void setLastRead(SimpMessageHeaderAccessor h, @Payload SetLastRead msg) throws Exception {
        var user = _getUser(h).orElseThrow();
        var member = roomService.getRoomMember(msg.getChannelId(), user.getId(), false);
        if (member.isEmpty())
            return;
        var m = member.get();
        roomService.setLastRead(m);

        messaging.convertAndSendToUser(
                user.getNickname().toLowerCase(),
                "/queue/last-read",
                new SetLastReadResponse(msg.getChannelId(), m.getLastRead())
        );
    }

    private <T> T _reply(SimpMessageHeaderAccessor h, T obj) {
        messaging.convertAndSendToUser(
                _getUserName(h),
                "/queue/r",
                obj, new HashMap<>() {{
                    put("r", h.getFirstNativeHeader("r"));
                }});
        return obj;
    }

    private <T> void _notifyUser(String nickname, String type, T obj) {
        messaging.convertAndSendToUser(
                nickname.toLowerCase(),
                "/queue/notify-updated",
                obj, new HashMap<>() {{
                    put("type", type);
                }});
    }

    private <T> void _notifyChannel(UUID channel, String type, T obj) {
        messaging.convertAndSend("/topic/channel/notify/" + channel.toString().toLowerCase(), obj, new HashMap<>() {{
            put("type", type);
        }});
    }

    private Optional<User> _getUser(SimpMessageHeaderAccessor h) throws Exception {
        var ret = userService.findById(_getUserId(h));
        return ret;
    }

    private int _getUserId(SimpMessageHeaderAccessor h) {
        var str = h.getUser();
        if (str == null)
            return -1;
        return ((UserClaim) str).getId();
    }

    private String _getUserName(SimpMessageHeaderAccessor h) {
        var str = h.getUser();
        if (str == null)
            return null;
        return ((UserClaim) str).getName();
    }


    @MessageMapping("/create-room/direct")
    public void createRoomDirect(SimpMessageHeaderAccessor h, @Payload String nickname) throws Exception {
        var user = _getUser(h);
        user.ifPresent(value -> {
            var res = roomService.createDirectChatByNickname(value, nickname);
            res.getSecond().ifPresent(room -> {
                for (var member : room.getMembers())
                    _notifyUser(member.getUser().getNickname(), "new-room", room.getPublicId());
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
                    _notifyUser(member.getUser().getNickname(), "new-room", room.getPublicId());
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
                _notifyUser(value.getNickname(), "new-room", res.getChatRoomPublicId());
            }
            _reply(h, res);
        });
    }

    @MessageMapping("/manage-room/code")
    public void editRoomCode(SimpMessageHeaderAccessor h, @Payload EditRoomCodeRequest model) throws Exception {
        var member = roomService.getRoomMember(model.getChatRoomId(), _getUserId(h), false);
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
        _notifyChannel(model.getChatRoomId(), "joincode", new NotifyChannelJoinCode(model.getChatRoomId(), code));
    }


}
