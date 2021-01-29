package com.holytrinity.nerdchat.auth;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.util.StringUtils;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

public class AuthFilter extends AbstractAuthenticationProcessingFilter {

    public static final String TOKEN_HEADER = "X-token";


    public AuthFilter(RequestMatcher requestMatcher) {
        super(requestMatcher);
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, final FilterChain chain) throws IOException, ServletException {
        final String token = getTokenValue((HttpServletRequest) request);

        //This filter only applies if the header is present
        if (StringUtils.isEmpty(token)) {
            chain.doFilter(request, response);
            return;
        }

        //On success keep going on the chain
        this.setAuthenticationSuccessHandler((request1, response1, authentication) -> {
            chain.doFilter(request1, response1);
        });

        super.doFilter(request, response, chain);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) {

        final String tokenValue = getTokenValue(request);

        if (StringUtils.isEmpty(tokenValue)) {
            return null;
        }

        AuthenticationToken token = new AuthenticationToken(tokenValue);
        token.setDetails(authenticationDetailsSource.buildDetails(request));

        return this.getAuthenticationManager().authenticate(token);
    }

    private String getTokenValue(HttpServletRequest req) {
        return Collections.list(req.getHeaderNames()).stream()
                .filter(header -> header.equalsIgnoreCase(TOKEN_HEADER))
                .map(req::getHeader)
                .findFirst()
                .orElse(null);
    }
}