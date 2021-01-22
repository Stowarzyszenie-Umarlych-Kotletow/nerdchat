package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.UserCredentials;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface UserCredentialsRepository extends CrudRepository<UserCredentials, Integer> {
}
