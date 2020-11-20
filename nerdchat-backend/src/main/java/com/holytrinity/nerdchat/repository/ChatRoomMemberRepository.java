package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.ChatRoomMember;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRoomMemberRepository extends PagingAndSortingRepository<ChatRoomMember, UUID> {
    List<ChatRoomMember> findByUser_id(UUID userId);
    Optional<ChatRoomMember> findFirstByChatRoom_IdAndUser_idNot(UUID chatRoomid, UUID user);
    Optional<ChatRoomMember> findFirstByChatRoom_IdAndUser_id(UUID chatRoomid, UUID user);
}
