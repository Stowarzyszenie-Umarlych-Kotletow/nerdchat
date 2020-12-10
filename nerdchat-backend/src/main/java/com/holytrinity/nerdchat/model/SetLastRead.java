package com.holytrinity.nerdchat.model;

import lombok.Data;

import java.util.UUID;

@Data
public class SetLastRead {
    public UUID userId;
    public UUID channelId;
}
