package com.holytrinity.nerdchat;

import com.holytrinity.nerdchat.entity.*;
import com.holytrinity.nerdchat.model.ChatMessageStatus;
import com.holytrinity.nerdchat.model.UploadedFileType;
import com.holytrinity.nerdchat.repository.*;
import com.holytrinity.nerdchat.service.ChatMessageService;
import com.holytrinity.nerdchat.service.ChatRoomService;
import com.holytrinity.nerdchat.service.UserService;
import com.holytrinity.nerdchat.utils.RandomUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@Transactional
public class DataSeeder implements ApplicationRunner {
    @Autowired
    private UserRepository users;
    @Autowired
    private ChatRoomRepository chatRooms;
    @Autowired
    private ChatRoomMemberRepository chatMembers;
    @Autowired
    private UserCredentialsRepository credentials;
    @Autowired
    private ChatRoomService chatRoomService;
    @Autowired
    private ChatMessageService chatMessageService;
    @Autowired
    private UserService userService;
    @Autowired
    private UserChatConfigRepository configs;
    @Autowired
    private ChatMessageRepository chatMessages;
    @Autowired
    private EmojiRepository emojis;
    @Autowired
    private EntityManager entities;

    ChatRoom direct(User u1, User u2) {
        return chatRooms.findById(chatRoomService.createDirectChat(u1, u2)).orElseThrow();
    }

    private void seed() {
        var userA = User.builder()
                .firstName("Jan")
                .lastName("Kowalski")
                .nickname("kowal")
                .build();
        var userB = User.builder()
                .firstName("Adam")
                .lastName("Kowalczyk")
                .nickname("lepszykowal")
                .build();
        var userC = User.builder()
                .firstName("Zbigniew")
                .lastName("Noga")
                .nickname("zzz")
                .build();
        var users = new ArrayList<User>(List.of(userA, userB, userC));
        credentials.saveAll(
                users.stream().map(u -> new UserCredentials(u, "ziemniak")).collect(Collectors.toList())
        );

        var chatAB = direct(userA, userB);
        var chatAC = direct(userA, userC);
        chatMessages.save(ChatMessage.builder()
                .content("Hey!")
                .chatRoomMember(chatAB.getMembers().get(1))
                .build());

        chatMessages.save(ChatMessage.builder()
                .content("hello there")
                .chatRoomMember(chatAC.getMembers().get(1))
                .build());
        emojis.saveAll(List.of(new Emoji("jamesmay", "\uD83D\uDC22"), new Emoji("heart", "❤️")));

    }


    public void run(ApplicationArguments args) {
        //seed();
        //generateConversations();
    }
}
