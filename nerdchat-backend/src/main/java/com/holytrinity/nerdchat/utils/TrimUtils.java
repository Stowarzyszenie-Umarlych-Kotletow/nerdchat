package com.holytrinity.nerdchat.utils;

public class TrimUtils {
    public static String sanitize(String key) {
        return key == null ? "" : key.toLowerCase().replaceAll("[^A-Za-z0-9_]", "");
    }
}
