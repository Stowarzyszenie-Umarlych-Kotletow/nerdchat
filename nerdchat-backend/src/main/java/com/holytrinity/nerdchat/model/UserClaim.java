package com.holytrinity.nerdchat.model;

import java.security.Principal;
import java.util.UUID;

public final class UserClaim implements Principal {

    private final String name;
    private final UUID id;

    public UserClaim(UUID id, String name) {
        this.name = name;
        this.id = id;
    }

    @Override
    public String getName() {
        return name;
    }

    public UUID getId() {
        return id;
    }
}