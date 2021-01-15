package com.holytrinity.nerdchat.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class UserAccessToken {
    @Id
    @GeneratedValue
    private UUID token;

    @ManyToOne(optional = true)
    @JoinColumn(name = "userId")
    private User user;

    @CreationTimestamp
    private Date createdAt;
}
