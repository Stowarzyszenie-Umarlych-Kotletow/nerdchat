package com.holytrinity.nerdchat;

import com.holytrinity.nerdchat.utils.Crypto;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

public class UtilTests {
    @Test
    public void Crypto_PasswordIsSalted() {
        var pass = "SomePassword123";
        assertThat(Crypto.encryptPassphrase(pass)).isNotEqualTo(Crypto.encryptPassphrase(pass));
    }

    @Test
    public void Crypto_HashSameLength() {
        assertThat(Crypto.encryptPassphrase("").length()).isEqualTo(Crypto.encryptPassphrase("asd123").length());
    }

    @Test
    public void Crypto_Verify() {
        var pass = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        var hash = Crypto.encryptPassphrase(pass);
        assertThat(Crypto.verifyPassphrase(pass, hash)).isTrue();
        assertThat(Crypto.verifyPassphrase("", hash)).isFalse();
    }
}
