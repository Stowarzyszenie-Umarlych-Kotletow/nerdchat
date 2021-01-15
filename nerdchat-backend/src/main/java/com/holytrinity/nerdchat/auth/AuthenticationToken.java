package com.holytrinity.nerdchat.auth;

import com.holytrinity.nerdchat.entity.User;
import org.springframework.security.authentication.AbstractAuthenticationToken;

import java.util.List;

public class AuthenticationToken extends AbstractAuthenticationToken {
    private final String token;
    private final User user;

    public AuthenticationToken(String token) {
        super(null);

        this.token = token;
        this.user = null;
        setAuthenticated(false);
    }

    public AuthenticationToken(String token, User user) {
        //note that the constructor needs a collection of GrantedAuthority
        //but our User have a collection of our UserRole's
        super(List.of());

        this.token = token;
        this.user = user;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return getToken();
    }

    @Override
    public Object getPrincipal() {
        return getUser();
    }

    public String getToken() {
        return token;
    }

    public User getUser() {
        return user;
    }
}