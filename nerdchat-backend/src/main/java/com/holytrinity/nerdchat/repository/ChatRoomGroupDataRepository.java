package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.ChatRoomGroupData;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ChatRoomGroupDataRepository extends CrudRepository<ChatRoomGroupData, UUID> {
    boolean existsByJoinCode(String code);
}
