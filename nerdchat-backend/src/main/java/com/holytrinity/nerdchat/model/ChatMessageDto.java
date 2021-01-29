package com.holytrinity.nerdchat.model;

import com.holytrinity.nerdchat.entity.ChatMessage;
import com.holytrinity.nerdchat.entity.ChatMessageAttachment;
import com.holytrinity.nerdchat.entity.UploadedFile;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.beans.BeanUtils;

import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Data

@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto extends BasicChatMessageDto {
    private UploadedFileDto attachment;

    public ChatMessageDto(int messageId, int senderId, String senderNickname, String senderfName, String senderlName, String content, Date sentAt, UploadedFile file, Integer attachmentId) {
        super(messageId, senderId, senderNickname, senderfName, senderlName, content, sentAt);
        attachment = UploadedFileDto.from(file);
        if (attachment != null && attachmentId != null)
            attachment.setId(attachmentId);
    }

    public static ChatMessageDto from(ChatMessage msg, ChatMessageAttachment atm) {
        var base = BasicChatMessageDto.from(msg);
        var obj = new ChatMessageDto(UploadedFileDto.from(atm));
        BeanUtils.copyProperties(base, obj);
        return obj;
    }


}
