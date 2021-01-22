package com.holytrinity.nerdchat.entity;

import com.holytrinity.nerdchat.utils.Encryption;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class UserCredentials {
    @Id
    @GeneratedValue
    private int id;

    @OneToOne(cascade=CascadeType.PERSIST)
    @JoinColumn(name = "userId")
    private User user;

    @UpdateTimestamp
    private Date changedAt;
    private String passwordHash;

    public UserCredentials(User user, String password) {
        this.user = user;
        passwordHash = Encryption.encryptPassphrase(password);
    }

    @Override
    public String toString() {
        return "User credentials #" + id;
    }
}
