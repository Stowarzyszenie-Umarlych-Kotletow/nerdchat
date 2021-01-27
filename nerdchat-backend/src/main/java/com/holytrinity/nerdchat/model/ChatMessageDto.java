package com.holytrinity.nerdchat.model;

import com.holytrinity.nerdchat.entity.ChatMessage;
import com.holytrinity.nerdchat.entity.UploadedFile;
import lombok.*;
import org.springframework.beans.BeanUtils;

import javax.swing.*;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Data

@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto extends BasicChatMessageDto {
    private UploadedFileDto attachment;


    public static ChatMessageDto from(ChatMessage msg) {
        var base = BasicChatMessageDto.from(msg);
        var file = msg.getAttachment();
        var obj = new ChatMessageDto(UploadedFileDto.from(file));
        BeanUtils.copyProperties(base, obj);
        return obj;
    }


}
