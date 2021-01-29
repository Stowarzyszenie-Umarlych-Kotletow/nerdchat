package com.holytrinity.nerdchat.model;

import com.holytrinity.nerdchat.entity.ChatMessageAttachment;
import com.holytrinity.nerdchat.entity.UploadedFile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.BeanUtils;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UploadedFileDto {
    private int id;
    private UploadedFileType type;
    private String contentType;

    private long size_bytes;
    private String checksum;
    private String name;

    private Date uploadedAt;

    public static UploadedFileDto from(UploadedFile file) {
        if (file == null) return null;
        var obj = new UploadedFileDto();
        BeanUtils.copyProperties(file, obj);
        return obj;
    }

    public static UploadedFileDto from(ChatMessageAttachment file) {
        if (file == null || file.getFile() == null) return null;
        var obj = from(file.getFile());
        obj.setId(file.getId());
        return obj;
    }


}
