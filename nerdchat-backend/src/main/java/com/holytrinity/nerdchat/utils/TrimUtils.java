package com.holytrinity.nerdchat.utils;

public class TrimUtils {
    public static String sanitize(String key) {
        return key == null ? "" : key.replaceAll("[^a-z0-9_]", "");
    }
}
