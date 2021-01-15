package com.holytrinity.nerdchat;

import com.holytrinity.nerdchat.entity.ChatMessage;
import com.holytrinity.nerdchat.entity.ChatRoom;
import com.holytrinity.nerdchat.entity.User;
import com.holytrinity.nerdchat.entity.UserCredentials;
import com.holytrinity.nerdchat.model.ChatRoomType;
import com.holytrinity.nerdchat.repository.*;
import com.holytrinity.nerdchat.service.ChatMessageService;
import com.holytrinity.nerdchat.service.ChatRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class DataSeeder implements ApplicationRunner {
    @Autowired private UserRepository users;
    @Autowired private ChatRoomRepository chatRooms;
    @Autowired private ChatRoomMemberRepository chatMembers;
    @Autowired private UserCredentialsRepository credentials;
    @Autowired private ChatRoomService chatRoomService;
    @Autowired private ChatMessageService chatMessageService;
    @Autowired private ChatMessageRepository chatMessages;

    public void run(ApplicationArguments args) {

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

        var chatAB = chatRoomService.createDirectChat(userA, userB);
        var chatAC = chatRoomService.createDirectChat(userA, userC);

        chatMessageService.save(ChatMessage.builder()
                .content("Hey!")
                .chatRoom(chatAB)
                .chatRoomMember(chatAB.getMembers().get(1))
                .build());

        chatMessageService.save(ChatMessage.builder()
                .content("hello there")
                .chatRoom(chatAC)
                .chatRoomMember(chatAC.getMembers().get(1))
                .build());

    }
}
