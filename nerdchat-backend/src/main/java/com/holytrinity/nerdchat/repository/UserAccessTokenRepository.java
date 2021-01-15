package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.UserAccessToken;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface UserAccessTokenRepository extends CrudRepository<UserAccessToken, UUID> {
}
