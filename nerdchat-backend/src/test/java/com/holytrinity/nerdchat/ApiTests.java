package com.holytrinity.nerdchat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.holytrinity.nerdchat.auth.MyAuthenticationProvider;
import com.holytrinity.nerdchat.controller.ApiController;
import com.holytrinity.nerdchat.controller.AuthController;
import com.holytrinity.nerdchat.entity.User;
import com.holytrinity.nerdchat.entity.UserCredentials;
import com.holytrinity.nerdchat.model.http.CreateAccountRequest;
import com.holytrinity.nerdchat.model.http.CreateTokenRequest;
import com.holytrinity.nerdchat.model.http.CreateTokenResponse;
import com.holytrinity.nerdchat.repository.EmojiRepository;
import com.holytrinity.nerdchat.repository.MessageAttachmentRepository;
import com.holytrinity.nerdchat.service.ChatMessageService;
import com.holytrinity.nerdchat.service.ChatRoomService;
import com.holytrinity.nerdchat.service.FileService;
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

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@WebMvcTest(value = ApiController.class)
public class ApiTests {
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
    @MockBean
    private ChatMessageService messages;
    @MockBean
    private ChatRoomService rooms;
    @MockBean
    private EmojiRepository emojis;
    @MockBean
    private EntityManager entities;
    @MockBean
    private FileService files;
    @MockBean
    private MessageAttachmentRepository attachments;


    @BeforeAll
    static void setup() {

    }

    @BeforeEach
    void init() {
        when(emojis.findAllDto()).thenReturn(new ArrayList<>());
        when(users.checkNicknameFree(Mockito.anyString())).thenReturn(true);
        when(users.verifyPassword(Mockito.any(), eq("pass"))).thenReturn(true);
        when(users.findByToken(eq("token"))).thenReturn(Optional.of(User.builder().nickname("user").build()));
        when(users.createToken(any())).thenReturn("new_token");

    }

    public static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void globalAnonymous() throws Exception {
        var ret = mvc.perform(get("/global/emojis")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn();
    }

    @Test
    void userRequiresAuth() throws Exception {
        var ret = mvc.perform(get("/user/chat_config"))
                .andExpect(status().isForbidden()).andReturn();
    }

    @Test
    void userAuth_valid() throws Exception {
        var ret = mvc.perform(get("/user/chat_config")
                .header("X-Token", "token"))
                .andExpect(status().isOk()).andReturn();
    }

}
