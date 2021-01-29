package com.holytrinity.nerdchat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.holytrinity.nerdchat.auth.MyAuthenticationProvider;
import com.holytrinity.nerdchat.controller.AuthController;
import com.holytrinity.nerdchat.entity.User;
import com.holytrinity.nerdchat.entity.UserCredentials;
import com.holytrinity.nerdchat.model.http.CreateAccountRequest;
import com.holytrinity.nerdchat.model.http.CreateTokenRequest;
import com.holytrinity.nerdchat.model.http.CreateTokenResponse;
import com.holytrinity.nerdchat.service.UserService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
@WebMvcTest(value = AuthController.class)
class AuthTests {

    @TestConfiguration
    static class TestConfig {
        @Bean
        public MyAuthenticationProvider auth() {
            return new MyAuthenticationProvider();
        }
    }

    @Autowired
    private MockMvc mvc;

    @MockBean
    private UserService users;

    @BeforeAll
    static void setup() {

    }

    @BeforeEach
    void init() {
        Mockito.when(users.checkNicknameFree(Mockito.anyString())).thenReturn(true);
        Mockito.when(users.verifyPassword(Mockito.any(), eq("pass"))).thenReturn(true);
        Mockito.when(users.findByToken(eq("token"))).thenReturn(Optional.of(User.builder().nickname("user").build()));
        Mockito.when(users.createToken(any())).thenReturn("new_token");
        Mockito.when(users.findCredentialsByNickname(eq("user"))).thenReturn(Optional.of(new UserCredentials(user().build(), "pass")));
    }

    public static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static User.UserBuilder user() {
        return User.builder()
                .nickname("user")
                .firstName("FirstName")
                .lastName("LastName");
    }

    public static CreateAccountRequest.CreateAccountRequestBuilder accountReq() {
        return CreateAccountRequest.builder()
                .firstName("FirstName")
                .lastName("LastName")
                .nickname("user")
                .password("ziemniak");
    }

    @Test
    void registerNicknamePrompt() throws Exception {
        var ret = mvc.perform(post("/auth/register_account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(accountReq().nickname("invalidNicką").build())))
                .andExpect(status().is4xxClientError()).andReturn();


    }

    @Test
    void registerPass() throws Exception {
        var user = accountReq().build();
        var ret = mvc.perform(post("/auth/register_account")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(user)))
                .andExpect(status().isOk()).andReturn();
        assertThat(ret.getResponse().getContentAsString()).contains(user.getNickname());
    }

    @Test
    void refreshToken_valid() throws Exception {
        var ret = mvc.perform(post("/auth/refresh_token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(new CreateTokenResponse("user", "token"))))
                .andExpect(status().isOk()).andReturn();
    }

    @Test
    void refreshToken_invalidToken() throws Exception {
        var ret = mvc.perform(post("/auth/refresh_token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(new CreateTokenResponse("user", "invtoken"))))
                .andExpect(status().is4xxClientError()).andReturn();
    }

    @Test
    void refreshToken_invalidNick() throws Exception {
        var ret = mvc.perform(post("/auth/refresh_token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(new CreateTokenResponse("user2", "token"))))
                .andExpect(status().is4xxClientError()).andReturn();
    }

    @Test
    void createToken_valid() throws Exception {
        var ret = mvc.perform(post("/auth/create_token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(new CreateTokenRequest("user", "pass"))))
                .andExpect(status().isOk()).andReturn();
        assertThat(ret.getResponse().getContentAsString()).contains("new_token");
    }

    @Test
    void createToken_invalid() throws Exception {
        var ret = mvc.perform(post("/auth/create_token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(new CreateTokenRequest("user", "invalidpass"))))
                .andExpect(status().is4xxClientError()).andReturn();
    }

}
