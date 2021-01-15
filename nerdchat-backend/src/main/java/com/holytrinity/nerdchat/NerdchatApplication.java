package com.holytrinity.nerdchat;

import com.holytrinity.nerdchat.auth.MyAuthenticationProvider;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationProvider;

@SpringBootApplication
public class NerdchatApplication {

    public static void main(String[] args) {
        SpringApplication.run(NerdchatApplication.class, args);
    }
    @Bean
    public AuthenticationProvider createCustomAuthenticationProvider() {
        return new MyAuthenticationProvider();
    }
}
