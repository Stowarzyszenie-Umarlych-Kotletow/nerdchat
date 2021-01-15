package com.holytrinity.nerdchat.utils;

import org.springframework.security.crypto.codec.Base64;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Random;

public class Encryption {
    public static final SecureRandom random = new SecureRandom();
    public static String encryptPassphrase(String passphrase) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");

            byte[] salt = new byte[18];

            random.nextBytes(salt);

            md.update(salt);
            md.update(passphrase.getBytes(StandardCharsets.UTF_8));

            byte[] passEnc = md.digest();
            return String.format("%s$%s",
                    new String(Base64.encode(salt)),
                    new String(Base64.encode(passEnc)));
        } catch (NoSuchAlgorithmException ex) {
            throw new RuntimeException(ex);
        }
    }

    public static boolean verifyPassphrase(String passphrase, String encryptedPassphrase) {
        String[] split = encryptedPassphrase.split("\\$");
        byte[] salt = Base64.decode(split[0].getBytes());
        byte[] passEncDb = Base64.decode(split[1].getBytes());

        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");

            md.update(salt);
            md.update(passphrase.getBytes(StandardCharsets.UTF_8));
            byte[] passEnc = md.digest();
            return Arrays.equals(passEncDb, passEnc);
        } catch (NoSuchAlgorithmException ex) {
            throw new RuntimeException(ex);
        }
    }
}
