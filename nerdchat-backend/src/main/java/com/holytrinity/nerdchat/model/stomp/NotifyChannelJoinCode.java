package com.holytrinity.nerdchat.model.stomp;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class NotifyChannelJoinCode {
    private UUID chatRoomId;
    private String code;
}
