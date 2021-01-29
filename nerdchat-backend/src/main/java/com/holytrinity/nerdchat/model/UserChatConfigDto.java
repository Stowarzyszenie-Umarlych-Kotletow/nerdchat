package com.holytrinity.nerdchat.model;

import com.holytrinity.nerdchat.entity.UserChatConfig;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.BeanUtils;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserChatConfigDto {
    private Integer avatarId;
    private String textColorMain;
    private String textColorUser;
    private String accentsColor;
    private String backgroundColor;
    private Float fontSizeMultiplier;
    private Boolean showNotifications;

    public static UserChatConfigDto from(int avatarId, UserChatConfig cfg) {
        var dto = new UserChatConfigDto();
        if (cfg != null)
            BeanUtils.copyProperties(cfg, dto, "id");
        dto.setAvatarId(avatarId);
        return dto;
    }
}
