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

    private void generateConversations() {
        var emos = new ArrayList<Emoji>();
        emojis.saveAll(List.of(new Emoji("turtle", "\uD83D\uDC22"), new Emoji("heart", "❤️"))).forEach(emos::add);

        var users = new ArrayList<User>();
        var groups = new ArrayList<ChatRoom>();
        var groupMsgs = new ArrayList<ChatMessage>();
        int userCount = 50;
        for (int i = 0; i < userCount; i++) {
            var b = RandomUtils.randomUser()
                    .build();
            for (var u : users) {
                if (b.getNickname().equals(u.getNickname())) {
                    b = null;
                    break;
                }
            }
            if (b == null)
                continue;


            var hasToken = RandomUtils.bool();
            if (hasToken) {
                b.setAccessTokens(List.of(UserAccessToken.builder().createdAt(RandomUtils.date()).user(b).build()));
            }
            userService.save(b);
            users.add(b);
            var hasConfig = RandomUtils.bool();
            if (hasConfig) {
                entities.persist(UserChatConfig.builder().user(b).build());
            }
            var creds = new UserCredentials(b, "ziemniak");
            entities.persist(creds);

        }

        var polls = new ArrayList<Poll>();

        var groupCount = 8;
        for (int i = 0; i < groupCount; i++) {
            var user = RandomUtils.item(users);
            var res = chatRoomService.createGroupChat(user, RandomUtils.word());
            var chat = res.getSecond().orElseThrow();
            var member = chatRoomService.findRoomMember(chat.getId(), user.getId()).orElseThrow();
            groups.add(chat);

            var poll = RandomUtils.getPoll().author(user).build();
            for (var ans : poll.getAnswers()) {
                ans.setPoll(poll);
            }
            entities.persist(poll);
            var msg = RandomUtils.randomMessage()
                    .chatRoomMember(member)
                    .messagePoll(poll)
                    .build();
            chatMessages.save(msg);
            groupMsgs.add(msg);
        }

        var filesCount = 20;
        var files = new ArrayList<UploadedFile>();

        for (int i = 0; i < filesCount; i++) {
            var user = RandomUtils.item(users);
            var types = List.of(
                    Pair.of(UploadedFileType.AUDIO, "mp3"),
                    Pair.of(UploadedFileType.IMAGE, "png"),
                    Pair.of(UploadedFileType.VIDEO, "mp4"),
                    Pair.of(UploadedFileType.OTHER, "exe"));
            var name = RandomUtils.word();
            var size = RandomUtils.getRandomNumber(512, 10_000_000);
            var checksum = UUID.randomUUID().toString();

            var f = RandomUtils.item(types);
            var file = UploadedFile.builder()
                    .author(user)
                    .checksum(checksum)
                    .name(name + "." + f.getSecond())
                    .type(f.getFirst())
                    .size_bytes(size)
                    .uploadedAt(RandomUtils.date()).build();
            entities.persist(file);
            files.add(file);
        }


        for (int i = 0; i < users.size(); i++) {
            int directs = RandomUtils.getRandomNumber(0, 5);
            var user = users.get(i);
            for (int j = i + 1; j < Math.min(users.size(), i + 1 + directs); j++) {
                var otherUser = users.get(j);
                var room = direct(user, otherUser);
                var members = room.getMembers();
                var messages = RandomUtils.getRandomNumber(3, 12);
                var msgs = new ArrayList<ChatMessage>();
                var atm = new ArrayList<ChatMessageAttachment>();
                for (int k = 0; k < messages; k++) {
                    var msg = RandomUtils.randomMessage()
                            .chatRoomMember(members.get(RandomUtils.getRandomNumber(0, 2)))
                            .messageStatus(k == 0 ? ChatMessageStatus.SENDING : ChatMessageStatus.SENT);
                    var bm = msg.build();
                    if (RandomUtils.bool()) {
                        bm.setReactions(List.of(ChatMessageReaction.builder()
                                .emoji(RandomUtils.item(emos))
                                .chatMessage(bm)
                                .chatRoomMember(RandomUtils.item(members)).build()));
                    }

                    if (RandomUtils.getRandomNumber(0, 10) == 0) {
                        var file = RandomUtils.item(files);
                        var attachment = ChatMessageAttachment.builder()
                                .file(file)
                                .message(bm)
                                .build();
                        atm.add(attachment);
                        //TODO fix
                    }
                    msgs.add(bm);

                }
                chatMessages.saveAll(msgs);
                atm.forEach(entities::persist);
            }

            try {
                if (RandomUtils.bool()) {
                    var g = RandomUtils.getRandomNumber(0, groups.size());
                    var group = groups.get(g);
                    var msg = groupMsgs.get(g);
                    var member = chatMembers.findById(chatRoomService.joinChat(user.getId(), group.getId())).orElseThrow();
                    entities.persist(ChatMessageReaction.builder().chatMessage(msg).chatRoomMember(member).emoji(RandomUtils.item(emos)).build());
                    entities.persist(PollVote.builder().voter(user).answer(RandomUtils.item(msg.getMessagePoll().getAnswers())).build());
                    chatMessages.save(RandomUtils.randomMessage().chatRoomMember(member).build());
                }

            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }


    }


    public void run(ApplicationArguments args) {
        //seed();
        //generateConversations();
    }
}
