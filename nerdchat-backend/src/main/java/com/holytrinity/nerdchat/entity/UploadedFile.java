package com.holytrinity.nerdchat.entity;

import com.holytrinity.nerdchat.model.UploadedFileType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.apachecommons.CommonsLog;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "uploaded_files")
public class UploadedFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", foreignKey = @ForeignKey(name = "files_users_fk"))
    private User author;

    @Enumerated(EnumType.STRING)
    private UploadedFileType type;

    private long size_bytes;
    private String checksum;
    private String name;

    @CreationTimestamp
    @Column(nullable = false)
    private Date uploadedAt;

    @OneToMany(fetch=FetchType.LAZY, mappedBy = "file")
    private List<ChatMessageAttachment> chatFiles;

}
