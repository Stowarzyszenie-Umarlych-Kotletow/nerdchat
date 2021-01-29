package com.holytrinity.nerdchat.service;

import com.holytrinity.nerdchat.entity.User;
import com.holytrinity.nerdchat.entity.UserAccessToken;
import com.holytrinity.nerdchat.entity.UserChatConfig;
import com.holytrinity.nerdchat.entity.UserCredentials;
import com.holytrinity.nerdchat.repository.UserAccessTokenRepository;
import com.holytrinity.nerdchat.repository.UserChatConfigRepository;
import com.holytrinity.nerdchat.repository.UserRepository;
import com.holytrinity.nerdchat.utils.Crypto;
import com.holytrinity.nerdchat.utils.TrimUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    @Autowired
    private UserRepository users;
    @Autowired
    private UserAccessTokenRepository tokens;
    @Autowired
    private EntityManager entities;


    public Optional<UserCredentials> findCredentialsByNickname(String nickname) {
        return users.findCredentials(nickname);
    }

    public Optional<User> findByNickname(String nickname) {
        return users.findByNickname(nickname.toLowerCase());
    }

    public Optional<User> findByToken(String token) {
        var tid = UUID.fromString(token);
        var created = Instant.now().minus(24, ChronoUnit.HOURS);
        return users.findByToken(tid, Date.from(created));
    }

    public Optional<User> findById(int id) {
        return users.findById(id);
    }

    public boolean verifyPassword(UserCredentials creds, String password) {
        return Crypto.verifyPassphrase(password, creds.getPasswordHash());
    }

    public String createToken(User user) {
        var token = UserAccessToken.builder().user(user).build();
        tokens.save(token);
        return token.getToken().toString().toLowerCase();
    }

    public static String sanitizeNickname(String nickname) {
        return nickname.toLowerCase().trim();
    }

    public static User newModel(String nickname, String firstName, String lastName) {
        return User.builder().firstName(firstName.trim()).lastName(lastName.trim()).nickname(sanitizeNickname(nickname)).build();
    }

    public static boolean checkNickname(String nickname) {
        return nickname.length() > 1 && nickname.length() <= 16
                && nickname.toLowerCase().equals(TrimUtils.sanitize(nickname));
    }

    public boolean checkNicknameFree(String nickname) {
        return !users.existsByNickname(sanitizeNickname(nickname));
    }

    public Optional<UserChatConfig> getUserConfig(int userId) {
        return users.findConfig(userId);
    }

    public void save(User user) {
        users.save(user);
    }
    public void save(UserCredentials creds) {entities.persist(creds);}


}
