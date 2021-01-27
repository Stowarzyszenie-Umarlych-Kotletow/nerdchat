package com.holytrinity.nerdchat.entity;

import com.holytrinity.nerdchat.utils.Crypto;
import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user_credentials")
public class UserCredentials {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne(cascade=CascadeType.PERSIST, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "creds_users_fk"))
    private User user;

    //@UpdateTimestamp
    private Date changedAt;
    private String passwordHash;

    public UserCredentials(User user, String password) {
        this.user = user;
        passwordHash = Crypto.encryptPassphrase(password);
    }

    @Override
    public String toString() {
        return "User credentials #" + id;
    }
}
