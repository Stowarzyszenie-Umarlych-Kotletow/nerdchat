package com.holytrinity.nerdchat.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user_access_tokens")
public class UserAccessToken {
    @Id
    @GeneratedValue(generator = "UUID")
    @Column(length = 16)
    private UUID token;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "tokens_users_fk"))
    private User user;

    //@CreationTimestamp
    private Date createdAt;
}
