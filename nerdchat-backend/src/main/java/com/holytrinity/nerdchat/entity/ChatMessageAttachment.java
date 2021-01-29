package com.holytrinity.nerdchat.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "message_attachments")
public class ChatMessageAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "file_id", nullable = false, foreignKey = @ForeignKey(name = "attachments_files_fk"))
    private UploadedFile file;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id", nullable = false, foreignKey = @ForeignKey(name = "attachments_messages_fk"))
    private ChatMessage message;
}
