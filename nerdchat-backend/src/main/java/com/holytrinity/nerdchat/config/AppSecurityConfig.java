package com.holytrinity.nerdchat.config;

import com.holytrinity.nerdchat.auth.AuthFilter;
import com.holytrinity.nerdchat.auth.MyAuthenticationProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.security.web.savedrequest.NullRequestCache;
import org.springframework.security.web.session.SessionManagementFilter;
import org.springframework.security.web.util.matcher.AndRequestMatcher;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.NegatedRequestMatcher;

@Configuration
@EnableWebSecurity

public class AppSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired private MyAuthenticationProvider provider;

    @Bean
    AnyCorsFilter anycorsFilter() {
        return new AnyCorsFilter();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        var filter = anycorsFilter();
        http.addFilterBefore(createCustomFilter(), AnonymousAuthenticationFilter.class).
                addFilterBefore(anycorsFilter(), AuthFilter.class).
                authorizeRequests()
                .antMatchers(HttpMethod.OPTIONS).permitAll()
                .antMatchers("/auth/**", "/global/**", "/ws/**", "/h2-console/**").permitAll()
                .anyRequest().authenticated();
        http.csrf().disable();
        http.headers().frameOptions().sameOrigin();
        http.requestCache().requestCache(new NullRequestCache());
    }

    protected AbstractAuthenticationProcessingFilter createCustomFilter() throws Exception {
        var filter = new AuthFilter(new NegatedRequestMatcher(
                new AndRequestMatcher(
                        new AntPathRequestMatcher("/auth/**")
                )
        ));
        filter.setAuthenticationManager(authenticationManagerBean());
        return filter;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(provider);
    }

}