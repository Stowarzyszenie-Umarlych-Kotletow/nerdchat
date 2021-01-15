package com.holytrinity.nerdchat.controller;

import com.holytrinity.nerdchat.entity.User;
import com.holytrinity.nerdchat.model.ChatMessageDto;
import com.holytrinity.nerdchat.model.http.ApiResponse;
import com.holytrinity.nerdchat.repository.ChatRoomMemberRepository;
import com.holytrinity.nerdchat.service.ChatMessageService;
import com.holytrinity.nerdchat.service.ChatRoomService;
import com.holytrinity.nerdchat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;
import java.util.stream.Collectors;

@Controller
public class ApiController {
    @Autowired
    private SimpUserRegistry users;
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

    private User getUser() {
        return (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private <T> ResponseEntity<ApiResponse<T>> ok(T data) {
        return ResponseEntity.ok(new ApiResponse<T>(data));
    }

    private <T> ResponseEntity<ApiResponse<T>> error(String error) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<T>(error));
    }

    private <T> ResponseEntity<ApiResponse<T>> notfound(String error) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<T>(error));
    }

    @GetMapping("/chatroom/{roomId}/messages")
    public ResponseEntity<?> getChatMessages(@PathVariable UUID roomId) {

        return ok(messageService.findByChatRoomId(roomId, Sort.by("sentAt").ascending()).stream()
                .map(x -> ChatMessageDto.from(x)).collect(Collectors.toList()));
    }

    @GetMapping("/message/{messageId}")
    public ResponseEntity<?> getChatMessage(@PathVariable UUID messageId) {
        return ok(messageService.findById(messageId));
    }

    @GetMapping("/user/chatrooms/list")
    public ResponseEntity<?> getChatRooms() {
        var u = getUser();
        return ok(roomService.getUserChatRoomList(u.getId()));
    }

    @GetMapping("/users/id/by/nickname/{nickname}")
    public ResponseEntity<?> getUserIdByNickname(@PathVariable String nickname) {
        var user = userService.findByNickname(nickname);
        if (user.isPresent())
            return ok(user.get().getId());
        return notfound("");
    }
}
