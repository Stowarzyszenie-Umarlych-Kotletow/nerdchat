package com.holytrinity.nerdchat.controller;

import com.holytrinity.nerdchat.entity.ChatMessageAttachment;
import com.holytrinity.nerdchat.entity.UploadedFile;
import com.holytrinity.nerdchat.entity.User;
import com.holytrinity.nerdchat.entity.UserChatConfig;
import com.holytrinity.nerdchat.exception.ApiException;
import com.holytrinity.nerdchat.model.UploadedFileDto;
import com.holytrinity.nerdchat.model.UserChatConfigDto;
import com.holytrinity.nerdchat.model.http.ApiResponse;
import com.holytrinity.nerdchat.repository.ChatMessageRepository;
import com.holytrinity.nerdchat.repository.EmojiRepository;
import com.holytrinity.nerdchat.repository.MessageAttachmentRepository;
import com.holytrinity.nerdchat.repository.UploadedFileRepository;
import com.holytrinity.nerdchat.service.ChatMessageService;
import com.holytrinity.nerdchat.service.ChatRoomService;
import com.holytrinity.nerdchat.service.FileService;
import com.holytrinity.nerdchat.service.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityManager;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

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
    @Autowired private FileService fileService;
    @Autowired private MessageAttachmentRepository attachments;

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
        var cfg = userService.getUserConfig(user.getId());
        return cfg.map(c -> ok(UserChatConfigDto.from(c))).orElseGet(() -> notfound("no config"));
    }

    @PostMapping("/user/chat_config")
    public ResponseEntity<?> postChatConfig(@RequestBody UserChatConfigDto body) {
        var user = getUser();
        var cfg = userService.getUserConfig(user.getId()).orElseGet(() -> UserChatConfig.builder().user(user).build());
        BeanUtils.copyProperties(body, cfg);
        entities.persist(cfg);
        return ok(true);
    }

    @GetMapping("/global/emojis")
    public ResponseEntity<?> getEmojiTable() {
        return ok(emojis.findAllDto());
    }

    @PostMapping("/user/files/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            var model = fileService.uploadFile(UploadedFile.builder().author(getUser()), file);
            return ok(UploadedFileDto.from(model));
        }catch(ApiException ex) {
            return error(ex.getMsg());
        }
        catch(Exception ex) {
            return error("Unknown error");
        }

    }

    @GetMapping("/user/files")
    public ResponseEntity<?> getMyFiles() {
        return ok(fileService.findMyFiles(getUser(), 0, 5));
    }


    private ResponseEntity<?> _downloadFile(UploadedFile m) {
        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(m.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + URLEncoder.encode(m.getName(), StandardCharsets.UTF_8))
                .body(fileService.getUri(m));
    }

    @GetMapping("/global/file/{id}")
    public ResponseEntity<?> downloadFileUnsafe(@PathVariable int id) {
        var file = fileService.getRepo().findById(id);//
        if(file.isEmpty()) {
            return notfound("file not found");
        }
        return _downloadFile(file.get());

    }
    @GetMapping("/global/message/{messageId}/attachment/{attachmentId}/download")
    public ResponseEntity<?> downloadMessageAttachment(@PathVariable int messageId, @PathVariable int attachmentId) {
        var atm = attachments.findByIdAndMessageId(attachmentId, messageId);
        if(atm.isEmpty())
            return notfound("");
        return _downloadFile(atm.get().getFile());
    }


}
