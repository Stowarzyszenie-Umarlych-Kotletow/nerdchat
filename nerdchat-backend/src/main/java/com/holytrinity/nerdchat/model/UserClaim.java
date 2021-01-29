package com.holytrinity.nerdchat.model;

import java.security.Principal;

public final class UserClaim implements Principal {

    private final String name;
    private final int id;

    public UserClaim(int id, String name) {
        this.name = name;
        this.id = id;
    }

    @Override
    public String getName() {
        return name;
    }

    public int getId() {
        return id;
    }
}