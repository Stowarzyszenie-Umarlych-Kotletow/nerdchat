package com.holytrinity.nerdchat.auth;

import com.holytrinity.nerdchat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class MyAuthenticationProvider implements AuthenticationProvider {

    @Autowired
    private UserService users;

    @Override
    public Authentication authenticate(Authentication auth) throws AuthenticationException {
        final AuthenticationToken tokenContainer = (AuthenticationToken) auth;
        final String token = tokenContainer.getToken();

        var user = users.findByToken(token);
        if (user.isEmpty())
            throw new BadCredentialsException("Invalid token");

        return new AuthenticationToken(token, user.get());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return AuthenticationToken.class.isAssignableFrom(authentication);
    }
}