package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.ChatRoomMember;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRoomMemberRepository extends PagingAndSortingRepository<ChatRoomMember, Integer> {
    List<ChatRoomMember> findByUser_id(int userId);

    Optional<ChatRoomMember> findFirstByChatRoom_IdAndUser_idNot(int chatRoomid, int userId);

    Optional<ChatRoomMember> findFirstByChatRoom_IdAndUser_id(int chatRoomid, int userId);

    Optional<ChatRoomMember> findFirstByChatRoom_PublicIdAndUser_id(UUID chatRoomid, int userId);

}
