package com.holytrinity.nerdchat.model;

import com.holytrinity.nerdchat.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserChatConfigDto {
    private String textColorMain;
    private String textColorUser;
    private String accentsColor;
    private String backgroundColor;
    private float fontSizeMultiplier;
    private boolean showNotifications;
}
