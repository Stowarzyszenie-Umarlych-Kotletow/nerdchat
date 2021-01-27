package com.holytrinity.nerdchat.controller;

import com.holytrinity.nerdchat.entity.UploadedFile;
import com.holytrinity.nerdchat.entity.User;
import com.holytrinity.nerdchat.entity.UserChatConfig;
import com.holytrinity.nerdchat.exception.ApiException;
import com.holytrinity.nerdchat.model.ChatMessageDto;
import com.holytrinity.nerdchat.model.EmojiDto;
import com.holytrinity.nerdchat.model.UserChatConfigDto;
import com.holytrinity.nerdchat.model.http.ApiResponse;
import com.holytrinity.nerdchat.repository.ChatRoomMemberRepository;
import com.holytrinity.nerdchat.repository.EmojiRepository;
import com.holytrinity.nerdchat.service.ChatMessageService;
import com.holytrinity.nerdchat.service.ChatRoomService;
import com.holytrinity.nerdchat.service.FileService;
import com.holytrinity.nerdchat.service.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Controller
@Transactional
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
    private UserService userService;
    @Autowired
    private EmojiRepository emojis;
    @Autowired private EntityManager entities;
    @Autowired private FileService files;

    private User getUser() {
        return (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private <T> ResponseEntity<ApiResponse<T>> ok(T data) {
        return ResponseEntity.ok(new ApiResponse<T>(data));
    }

    private <T> ResponseEntity<ApiResponse<T>> error(String error) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<T>(null, error));
    }

    private <T> ResponseEntity<ApiResponse<T>> notfound(String error) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<T>(null, error));
    }

    @GetMapping("/chatroom/{roomId}/messages")
    public ResponseEntity<?> getChatMessages(@PathVariable UUID roomId) {

        return ok(messageService.findByChatRoomId(roomId));
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

    @GetMapping("/user/chat_config")
    public ResponseEntity<?> getChatConfig() {
        var user = getUser();
        var cfg = user.getConfig();
        if(cfg == null)
            return notfound("no config");
        return ok(UserChatConfigDto.from(cfg));
    }

    @PostMapping("/user/chat_config")
    public ResponseEntity<?> postChatConfig(@RequestBody UserChatConfigDto body) {
        var user = getUser();
        var cfg = user.getConfig();
        if(cfg == null) {
            user.setConfig(cfg = UserChatConfig.builder().user(user).build());
        }
        BeanUtils.copyProperties(body, cfg);
        userService.save(user);
        return ok(true);
    }

    @GetMapping("/global/emojis")
    public ResponseEntity<?> getEmojiTable() {
        return ok(emojis.findAllDto());
    }

    @PostMapping("/user/files/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            var model = files.uploadFile(UploadedFile.builder().author(getUser()), file);
            return ok(model);
        }catch(ApiException ex) {
            return error(ex.getMsg());
        }
        catch(Exception ex) {
            return error("Unknown error");
        }

    }

}
