package com.holytrinity.nerdchat.model;

import java.security.Principal;
import java.util.UUID;

public final class SimpUser implements Principal {

    private final String name;
    private final UUID id;

    public SimpUser(UUID id) {
        this.name = id.toString();
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