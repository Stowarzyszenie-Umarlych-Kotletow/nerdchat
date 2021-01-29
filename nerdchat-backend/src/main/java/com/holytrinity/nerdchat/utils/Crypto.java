package com.holytrinity.nerdchat.utils;

import org.springframework.core.io.InputStreamSource;
import org.springframework.security.crypto.codec.Base64;

import javax.xml.bind.annotation.adapters.HexBinaryAdapter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Arrays;

public class Crypto {
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

    public static String calcSHA1(InputStreamSource file) throws IOException, NoSuchAlgorithmException {

        var sha = MessageDigest.getInstance("SHA-1");
        try (var input = file.getInputStream()) {

            byte[] buffer = new byte[8192];
            int len = input.read(buffer);

            while (len != -1) {
                sha.update(buffer, 0, len);
                len = input.read(buffer);
            }

            return new HexBinaryAdapter().marshal(sha.digest());
        }
    }
}
