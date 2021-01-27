package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.UserChatConfig;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserChatConfigRepository extends CrudRepository<UserChatConfig, Integer> {
    public Optional<UserChatConfig> findByUserId(int userId);
}
