package com.holytrinity.nerdchat.controller;

import com.holytrinity.nerdchat.model.ChatMessageDto;
import com.holytrinity.nerdchat.model.http.ApiResponse;
import com.holytrinity.nerdchat.model.http.CreateTokenRequest;
import com.holytrinity.nerdchat.model.http.CreateTokenResponse;
import com.holytrinity.nerdchat.repository.ChatRoomMemberRepository;
import com.holytrinity.nerdchat.service.ChatMessageService;
import com.holytrinity.nerdchat.service.ChatRoomService;
import com.holytrinity.nerdchat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.stream.Collectors;

@Controller
public class AuthController {
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


    private <T> ResponseEntity<ApiResponse<T>> ok(T data) {
        return ResponseEntity.ok(new ApiResponse<T>(data));
    }

    private <T> ResponseEntity<ApiResponse<T>> error(String error) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<T>(error));
    }

    private <T> ResponseEntity<ApiResponse<T>> notfound(String error) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<T>(error));
    }

    @PostMapping("/auth/create_token")
    public ResponseEntity<?> authCreateToken(@RequestBody CreateTokenRequest model) {
        var creds = userService.findCredentialsByNickname(model.getNickname());
        if(creds.isEmpty())
            return notfound("User does not exist");
        var isOk = userService.verifyPassword(creds.get(), model.getPassword());
        if(!isOk)
            return error("Invalid password");
        var user = creds.get().getUser();
        var token = userService.createToken(user);

        return ok(new CreateTokenResponse(user.getNickname(), user.getId(), token));
    }

}