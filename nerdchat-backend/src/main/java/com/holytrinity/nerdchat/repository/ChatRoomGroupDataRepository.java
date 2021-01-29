package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.ChatRoomGroupData;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatRoomGroupDataRepository extends CrudRepository<ChatRoomGroupData, Integer> {
    Optional<ChatRoomGroupData> findFirstByJoinCode(String code);
}
