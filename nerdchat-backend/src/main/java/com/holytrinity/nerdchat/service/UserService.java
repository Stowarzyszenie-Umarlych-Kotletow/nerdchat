package com.holytrinity.nerdchat.service;

import com.holytrinity.nerdchat.entity.User;
import com.holytrinity.nerdchat.entity.UserAccessToken;
import com.holytrinity.nerdchat.entity.UserCredentials;
import com.holytrinity.nerdchat.repository.UserAccessTokenRepository;
import com.holytrinity.nerdchat.repository.UserRepository;
import com.holytrinity.nerdchat.utils.Encryption;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAmount;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    @Autowired private UserRepository users;
    @Autowired private UserAccessTokenRepository tokens;

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
    public Optional<User> findById(UUID id) { return users.findById(id); }
    public boolean verifyPassword(UserCredentials creds, String password) {
        return Encryption.verifyPassphrase(password, creds.getPasswordHash());
    }
    public String createToken(User user) {
        var token = UserAccessToken.builder().user(user).build();
        tokens.save(token);
        return token.getToken().toString().toLowerCase();
    }

    public String sanitizeNickname(String nickname) {
        return nickname.toLowerCase().trim();
    }

    public User newModel(String nickname, String firstName, String lastName) {
        return User.builder().firstName(firstName.trim()).lastName(lastName.trim()).nickname(sanitizeNickname(nickname)).build();
    }

    public boolean checkNickname(String nickname) {
        return nickname.length() > 1 && nickname.length() <= 16
                && nickname.equals(nickname.replaceAll("[^A-Za-z0-9_]", ""));
    }

    public boolean checkNicknameFree(String nickname) {
        return !users.existsByNickname(sanitizeNickname(nickname));
    }

}
