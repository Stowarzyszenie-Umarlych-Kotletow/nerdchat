package com.holytrinity.nerdchat;

import com.holytrinity.nerdchat.entity.*;
import com.holytrinity.nerdchat.model.ChatRoomType;
import com.holytrinity.nerdchat.repository.*;
import com.holytrinity.nerdchat.service.ChatMessageService;
import com.holytrinity.nerdchat.service.ChatRoomService;
import org.hibernate.boot.MetadataSources;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.tool.hbm2ddl.SchemaExport;
import org.hibernate.tool.schema.TargetType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.*;
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
    @Autowired private EmojiRepository emojis;

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

        var chatAB = chatRoomService.createDirectChat(userA, userB);
        var chatAC = chatRoomService.createDirectChat(userA, userC);

        chatMessageService.save(ChatMessage.builder()
                .content("Hey!")
                .chatRoomMember(chatAB.getMembers().get(1))
                .build());

        chatMessageService.save(ChatMessage.builder()
                .content("hello there")
                .chatRoomMember(chatAC.getMembers().get(1))
                .build());
        emojis.saveAll(List.of(new Emoji("jamesmay", "\uD83D\uDC22"), new Emoji("heart", "❤️")));

    }

    public void run(ApplicationArguments args) {
        //seed();
    }
}
