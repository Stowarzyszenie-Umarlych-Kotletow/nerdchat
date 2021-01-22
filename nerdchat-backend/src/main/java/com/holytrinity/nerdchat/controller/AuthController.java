package com.holytrinity.nerdchat.controller;

import com.holytrinity.nerdchat.entity.UserCredentials;
import com.holytrinity.nerdchat.model.ChatMessageDto;
import com.holytrinity.nerdchat.model.http.ApiResponse;
import com.holytrinity.nerdchat.model.http.CreateAccountRequest;
import com.holytrinity.nerdchat.model.http.CreateTokenRequest;
import com.holytrinity.nerdchat.model.http.CreateTokenResponse;
import com.holytrinity.nerdchat.repository.ChatRoomMemberRepository;
import com.holytrinity.nerdchat.repository.UserCredentialsRepository;
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
    private UserCredentialsRepository credentialsRepository;
    @Autowired
    private UserService userService;


    private <T> ResponseEntity<ApiResponse<T>> ok(T data) {
        return ResponseEntity.ok(new ApiResponse<T>(data));
    }

    private <T> ResponseEntity<ApiResponse<T>> error(String error) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<T>(null, error));
    }

    private <T> ResponseEntity<ApiResponse<T>> notfound(String error) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<T>(null, error));
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

        return ok(new CreateTokenResponse(user.getNickname(), token));
    }

    @PostMapping("/auth/refresh_token")
    public ResponseEntity<?> authCreateToken(@RequestBody CreateTokenResponse model) {
        var user = userService.findByToken(model.getToken());
        return user.map(u -> u.getNickname().equalsIgnoreCase(model.getNickname()) ? ok(model) : error("Invalid token")).orElseGet(() -> error("Invalid token"));
    }

    @PostMapping("/auth/register_account")
    public ResponseEntity<?> registerAccount(@RequestBody CreateAccountRequest model) {
        var user = userService.newModel(model.getNickname(), model.getFirstName(), model.getLastName());
        if(model.getFirstName().length() < 2 || model.getLastName().length() < 2) {
            return error("Please fill out all the fields.");
        }
        if(!userService.checkNickname(user.getNickname())) {
            return error("Invalid nickname - it must contain only 3-16 latin letters, numbers and underscores");
        }
        if(!userService.checkNicknameFree(user.getNickname())) {
            return error("The specified nickname is already in use.");
        }

        if(model.getPassword().length() < 6) {
            return error("The password must contain at least 6 characters.");
        }

        var creds = new UserCredentials(user, model.getPassword());
        credentialsRepository.save(creds);
        return ok(user.getNickname());
    }

}