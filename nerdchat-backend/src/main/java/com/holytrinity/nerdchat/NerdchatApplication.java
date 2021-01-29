package com.holytrinity.nerdchat;

import com.holytrinity.nerdchat.auth.MyAuthenticationProvider;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

@SpringBootApplication
public class NerdchatApplication {

    public static void main(String[] args) {
        SpringApplication.run(NerdchatApplication.class, args);
    }

    @Bean
    public AuthenticationProvider createCustomAuthenticationProvider() {
        return new MyAuthenticationProvider();
    }

    @Bean(name = "multipartResolver")
    public CommonsMultipartResolver multipartResolver() {
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
        multipartResolver.setMaxUploadSize(100 * 1024 * 1024);
        return multipartResolver;
    }
}
