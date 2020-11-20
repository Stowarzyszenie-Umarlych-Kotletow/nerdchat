package com.holytrinity.nerdchat.service;

import com.holytrinity.nerdchat.entity.User;
import com.holytrinity.nerdchat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired private UserRepository users;

    public Optional<User> findByNickname(String nickname) {
        return users.findByNickname(nickname.toLowerCase());
    }
}
