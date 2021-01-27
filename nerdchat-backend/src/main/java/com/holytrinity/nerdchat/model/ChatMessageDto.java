package com.holytrinity.nerdchat.model;

import com.holytrinity.nerdchat.entity.ChatMessage;
import com.holytrinity.nerdchat.entity.ChatMessageAttachment;
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

    public ChatMessageDto(int messageId, int senderId, String senderNickname, String senderfName, String senderlName, String content, Date sentAt, UploadedFile file, Integer attachmentId) {
        super(messageId, senderId, senderNickname, senderfName, senderlName, content, sentAt);
        attachment = UploadedFileDto.from(file);
        if(attachment != null && attachmentId != null)
            attachment.setId(attachmentId);
    }

    public static ChatMessageDto from(ChatMessage msg, ChatMessageAttachment atm) {
        var base = BasicChatMessageDto.from(msg);
        var obj = new ChatMessageDto(UploadedFileDto.from(atm));
        BeanUtils.copyProperties(base, obj);
        return obj;
    }


}
