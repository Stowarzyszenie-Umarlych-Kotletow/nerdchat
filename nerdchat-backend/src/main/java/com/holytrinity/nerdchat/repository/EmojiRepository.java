package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.Emoji;
import com.holytrinity.nerdchat.model.EmojiDto;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmojiRepository extends CrudRepository<Emoji, Integer> {
    @Query("SELECT e FROM Emoji e")
    List<EmojiDto> findAllDto();
}
