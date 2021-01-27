package com.holytrinity.nerdchat.service;

import com.holytrinity.nerdchat.entity.UploadedFile;
import com.holytrinity.nerdchat.exception.ApiException;
import com.holytrinity.nerdchat.model.UploadedFileType;
import com.holytrinity.nerdchat.repository.UploadedFileRepository;
import com.holytrinity.nerdchat.utils.Crypto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.spi.FileTypeDetector;

@Service
public class FileService {
    @Autowired
    private UploadedFileRepository repo;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public UploadedFile uploadFile(UploadedFile.UploadedFileBuilder builder, MultipartFile file) {

        try {
            var hash = Crypto.calcSHA1(file);
            var model = builder
                    .checksum(hash)
                    .contentType(file.getContentType())
                    .size_bytes(file.getSize())
                    .name(file.getOriginalFilename())
                    .type(UploadedFileType.OTHER)
                    .build();
            var location = Paths
                    .get(uploadDir + File.separator + StringUtils.cleanPath(file.getOriginalFilename()));
            Files.copy(file.getInputStream(), location, StandardCopyOption.REPLACE_EXISTING);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ApiException("Could not store file " + file.getOriginalFilename());
        }
    }
}