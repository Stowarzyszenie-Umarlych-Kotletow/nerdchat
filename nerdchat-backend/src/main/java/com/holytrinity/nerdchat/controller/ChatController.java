package com.holytrinity.nerdchat.controller;

import com.holytrinity.nerdchat.entity.ChatMessage;
import com.holytrinity.nerdchat.entity.User;
import com.holytrinity.nerdchat.exception.ApiException;
import com.holytrinity.nerdchat.model.*;
import com.holytrinity.nerdchat.model.http.ReactionCountSummary;
import com.holytrinity.nerdchat.model.stomp.EditRoomCodeRequest;
import com.holytrinity.nerdchat.model.stomp.NotifyChannelJoinCode;
import com.holytrinity.nerdchat.model.stomp.ReactToMessageRequest;
import com.holytrinity.nerdchat.repository.ChatRoomMemberRepository;
import com.holytrinity.nerdchat.repository.UploadedFileRepository;
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
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;

@Controller
@Transactional
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
    @Autowired
    private UploadedFileRepository files;

    @MessageMapping("/send-chat")
    public void sendChat(SimpMessageHeaderAccessor h, @Payload SendChatMessage msg) throws Exception {
        if ((msg.getContent() == null || msg.getContent().trim().length() == 0) && msg.getFileId() == null) return;
        var usrId = _getUserId(h);
        roomService.findRoomMember(msg.getChannelId(), usrId).ifPresent(member -> {
            var res = messageService.create(ChatMessage.builder()
                    .chatRoomMember(member)
                    .content(msg.getContent())
                    .sentAt(new Date()), msg.getFileId());
            var atm = res.getSecond().orElse(null);
            if (atm != null) {
                atm.setFile(files.findById(msg.getFileId()).orElseThrow());
            }
            var notification = ChatMessageDto.from(res.getFirst(), atm);
            _notifyChannel(msg.getChannelId(), "message", notification);
        });

    }

    @MessageMapping("/react-message")
    public void reactToMessage(SimpMessageHeaderAccessor h, @Payload ReactToMessageRequest req) {
        var usrId = _getUserId(h); // get authorized user ID
        var member = roomService.findRoomMember(req.getRoomId(), usrId)
                .orElseThrow(() -> new ApiException("user not found"));

        if (req.isState()) {
            // add reaction
            messageService.getReactionsRepo().reactToMessage(member.getId(), req.getMessageId(), req.getEmojiId());
        } else {
            // remove reaction
            var ret = messageService.getReactionsRepo().unreact(member.getId(), req.getMessageId());
            if (ret <= 0)
                return; // nothing changed
        }
        var data = messageService.getRepo().findMessageReactions(req.getMessageId(), member.getId());
        var obj = ReactionCountSummary.construct(req.getMessageId(), data);
        _reply(h, obj); // reply to the reacting user with updated reaction data for the message
        ReactionCountSummary.clearSelections(obj); // prepare data for other users (without selections)
        // send an event to all connected users in the channel
        _notifyChannel(req.getRoomId(), "message-reactions", obj);
    }


    @MessageMapping("/last-read")
    public void setLastRead(SimpMessageHeaderAccessor h, @Payload SetLastRead msg) throws Exception {
        var user = _getUser(h).orElseThrow();
        roomService.findRoomMember(msg.getChannelId(), user.getId()).ifPresent(
                m -> {
                    roomService.setLastRead(m);
                    messaging.convertAndSendToUser(
                            user.getNickname().toLowerCase(),
                            "/queue/last-read",
                            new SetLastReadResponse(msg.getChannelId(), new Date())
                    );
                }
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
            put("room", channel.toString().toLowerCase());
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
        var member = roomService.findRoomMember(model.getChatRoomId(), _getUserId(h));
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
