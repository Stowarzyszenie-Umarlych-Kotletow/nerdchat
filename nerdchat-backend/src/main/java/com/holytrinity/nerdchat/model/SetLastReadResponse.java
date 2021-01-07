package com.holytrinity.nerdchat.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Data
@AllArgsConstructor
public class SetLastReadResponse {
    public UUID chatRoomId;
    public Date date;
}
