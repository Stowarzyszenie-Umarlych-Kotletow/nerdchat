package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.User;
import com.holytrinity.nerdchat.entity.UserCredentials;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends CrudRepository<User, UUID> {
    Optional<User> findByNickname(String nickname);
    @Query("SELECT u FROM User u INNER JOIN UserAccessToken t ON (t.user.id=u.id) WHERE t.token=?1 AND t.createdAt >= ?2")
    Optional<User> findByToken(UUID token, Date createdFrom);
    @Query("SELECT c FROM UserCredentials c INNER JOIN User u ON (u.id=c.user.id) WHERE LOWER(u.nickname)=LOWER(?1)")
    Optional<UserCredentials> findCredentials(String nickname);
    boolean existsByNickname(String nickname);
}
