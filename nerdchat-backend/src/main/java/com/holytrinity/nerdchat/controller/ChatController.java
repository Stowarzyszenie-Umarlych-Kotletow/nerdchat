package com.holytrinity.nerdchat.controller;

import com.holytrinity.nerdchat.entity.ChatMessage;
import com.holytrinity.nerdchat.entity.ChatRoom;
import com.holytrinity.nerdchat.model.*;
import com.holytrinity.nerdchat.repository.ChatRoomMemberRepository;
import com.holytrinity.nerdchat.repository.UserRepository;
import com.holytrinity.nerdchat.service.ChatMessageService;
import com.holytrinity.nerdchat.service.ChatRoomService;
import com.holytrinity.nerdchat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.UUID;
import java.util.stream.Collectors;

@Controller
public class ChatController {
    @Autowired private SimpMessagingTemplate messaging;
    @Autowired private ChatMessageService messageService;
    @Autowired private ChatRoomService roomService;
    @Autowired private ChatRoomMemberRepository roomMemberRepository;
    @Autowired private UserService userService;

    @MessageMapping("/send-chat")
    public void sendChat(@Payload SendChatMessage msg) {
        System.out.println(msg.getContent());
        var chat = roomService.findById(msg.getChannelId());
        var member = roomService.getRoomMember(msg.getChannelId(), msg.getSenderId(), false);
        if(chat.isEmpty() || member.isEmpty())
            return;
        var message = messageService.save(ChatMessage.builder()
        .chatRoom(member.get().getChatRoom())
        .chatRoomMember(member.get())
        .content(msg.getContent())
        .sentAt(new Date())
        .build());

        var notification = BasicChatMessageDto.from(message);
        System.out.println("/topic/channel/notify/" + msg.getChannelId().toString());
        messaging.convertAndSend("/topic/channel/notify/" + msg.getChannelId().toString(), notification);
    }

    @MessageMapping("/last-read")
    public void setLastRead(@Payload SetLastRead msg) {
        var member = roomService.getRoomMember(msg.getChannelId(), msg.getUserId(), false);
        if(member.isEmpty())
            return;
        var m = member.get();
        roomService.setLastRead(m);
        messaging.convertAndSendToUser(
                msg.getUserId().toString().toLowerCase(),
                "/queue/last-read",
                new SetLastReadResponse(msg.getChannelId(), m.getLastRead())
        );
    }

    @GetMapping("/chatroom/{roomId}/messages")
    public ResponseEntity<?> getChatMessages(@PathVariable  UUID roomId) {
        return ResponseEntity.ok(messageService.findByChatRoomId(roomId, Sort.by("sentAt").ascending()).stream()
                .map(x -> ChatMessageDto.from(x)).collect(Collectors.toList()));
    }

    @GetMapping("/message/{messageId}")
    public ResponseEntity<?> getChatMessage(@PathVariable UUID messageId) {
        return ResponseEntity.ok(messageService.findById(messageId));
    }

    @GetMapping("/chatroom/list/{userId}")
    public ResponseEntity<?> getChatRooms(@PathVariable  UUID userId) {
        return ResponseEntity.ok(roomService.getUserChatRoomList(userId));
    }

    @GetMapping("/user/id/by/nickname/{nickname}")
    public ResponseEntity<?> getUserIdByNickname(@PathVariable String nickname) {
        var user = userService.findByNickname(nickname);
        if (user.isPresent())
            return ResponseEntity.ok(user.get().getId());
        return ResponseEntity.notFound().build();
    }

    @RequestMapping(value = "/chatroom/{chatId}/send", method = RequestMethod.POST)
    public ResponseEntity<?> sendMessage(@PathVariable UUID chatId, @RequestBody SendChatMessage msg) {
        var member = roomService.getRoomMember(chatId, msg.getSenderId(), false);
        var sentMsg = messageService.save(ChatMessage.builder()
        .chatRoomMember(member.get())
        .chatRoom(ChatRoom.builder().id(chatId).build())
        .content(msg.getContent())
        .build());
        var notification = BasicChatMessageDto.from(sentMsg);
        //System.out.println(messaging == null);
        //messaging.convertAndSend("/topic/channel/notify/" + msg.getChannelId().toString(), notification);
        return ResponseEntity.ok(chatId);
    }


}
