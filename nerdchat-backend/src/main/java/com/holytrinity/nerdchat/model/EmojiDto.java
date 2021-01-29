package com.holytrinity.nerdchat.model;


import com.holytrinity.nerdchat.entity.Emoji;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.BeanUtils;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class EmojiDto {
    private int id;
    private String label;
    private String dataText;

    public static EmojiDto from(Emoji obj) {
        var dto = new EmojiDto();
        BeanUtils.copyProperties(obj, dto);
        return dto;
    }
}
