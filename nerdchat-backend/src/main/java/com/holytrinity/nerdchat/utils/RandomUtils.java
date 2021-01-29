package com.holytrinity.nerdchat.utils;

import java.util.List;

public class RandomUtils {
    public static int getRandomNumber(int min, int max) {
        return (int) ((Math.random() * (max - min)) + min);
    }

    public static <T> T item(List<T> list) {
        return list.get(getRandomNumber(0, list.size()));
    }

    public static boolean bool() {
        return getRandomNumber(0, 2) == 1;
    }
}
