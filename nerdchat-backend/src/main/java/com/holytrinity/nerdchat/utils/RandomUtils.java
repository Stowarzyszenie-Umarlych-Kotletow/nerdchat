package com.holytrinity.nerdchat.utils;

import com.holytrinity.nerdchat.entity.*;

import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAmount;
import java.time.temporal.TemporalUnit;
import java.util.*;

public class RandomUtils {
    static List<String> firstNames = new ArrayList<String>(
            List.of(
                    "Jan", "Judy", "Marcin", "Karolina", "Wojciech",
                    "Adam", "Mark", "Karol", "Stanisław", "Leokadia",
                    "Rododendron", "Janusz"
            )
    );
    static List<String> lastNames = new ArrayList(List.of(
       "Kowalski", "Paczka", "Chrzan", "Margaryn", "Budum",
       "Pociecha", "Pucybut", "Kierko", "Opipko", "Kurnik",
       "Blin"
    ));
    static List<String> names = new ArrayList<>(List.of("drzewo","mistrz","kaczka","super","12","samuraj","szybki","robot","ninja","kot","pies","cichy","czarny","zielony","metalowy","miecz","rewolwer","tadeusz","grajek","15","1234","72754","1241"));
    static List<String> words = new ArrayList<>(List.of("co","hej","jak","tam","witam","pa","kolego","później","spadaj","czekaj","dzisiaj","gramy?","mordo","ziomek","kierowniku","bóbr"));

    public static int getRandomNumber(int min, int max) {
        return (int) ((Math.random() * (max - min)) + min);
    }
    public static <T> T item(List<T> list) {
        return list.get(getRandomNumber(0, list.size()));
    }

    static String str(List<String> list) {
        return item(list);
    }
    public static String word() {
        return str(words);
    }
    public static User.UserBuilder randomUser() {
        return User.builder()
                .firstName(str(firstNames))
                .lastName(str(lastNames))
                .nickname(str(names) + str(names) + str(names));
    }

    public static String randomTextMessage() {
        var len = getRandomNumber(1, 7);
        StringBuilder ret = new StringBuilder();
        for(int i = 0; i < len; i++) {
            if(i != 0)
                ret.append(' ');
            ret.append(str(words));
        }
        ret.append(str(List.of("", ".", "?", "!")));
        return ret.toString();
    }

    public static Poll.PollBuilder getPoll() {
        var answerCount = getRandomNumber(2, 6);
        var answers = new ArrayList<PollAnswer>();
        for(int i = 0; i < answerCount; i++) {
            answers.add(PollAnswer.builder().answerText(word()).build());
        }
        var date = date();
        var poll = Poll.builder()
                .createdAt(date)
                .expiresAt(bool() ? Date.from(date.toInstant().plus(getRandomNumber(1, 30), ChronoUnit.DAYS)) : null)
                .isMultichoice(bool())
                .questionText(randomTextMessage() + "?")
                .answers(answers);

        return poll;

    }

    public static Date date() {
        return Date.from(new Date(2020, Calendar.JANUARY, 1).toInstant().plusSeconds(getRandomNumber(0, 60*60*24*380)));
    }

    public static boolean bool() {
        return getRandomNumber(0, 2) == 1;
    }

    public static ChatMessage.ChatMessageBuilder randomMessage() {
        return ChatMessage.builder()
                .content(randomTextMessage())
                .sentAt(date());
    }
}
