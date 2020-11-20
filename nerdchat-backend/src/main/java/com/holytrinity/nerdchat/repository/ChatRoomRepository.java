package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.ChatRoom;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatRoomRepository extends CrudRepository<ChatRoom, UUID> {
}
