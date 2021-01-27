package com.holytrinity.nerdchat.service;

import com.holytrinity.nerdchat.entity.UploadedFile;
import com.holytrinity.nerdchat.entity.User;
import com.holytrinity.nerdchat.exception.ApiException;
import com.holytrinity.nerdchat.model.UploadedFileDto;
import com.holytrinity.nerdchat.model.UploadedFileType;
import com.holytrinity.nerdchat.repository.UploadedFileRepository;
import com.holytrinity.nerdchat.utils.Crypto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.spi.FileTypeDetector;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileService {
    @Autowired
    private UploadedFileRepository repo;

    @Value("${app.upload.dir}")
    private String uploadDir;

    private String getFileName(UploadedFile file) {
        return file.getChecksum() + "_" + file.getName().substring(Math.max(0, file.getName().length() - 6));
    }

    private Path getFilePath(UploadedFile file) {
        return Paths.get(uploadDir, getFileName(file));
    }

    public static UploadedFileType getFileType(String contentType) {
        if(contentType != null) {
            var lower = contentType.toLowerCase();
            if(lower.startsWith("audio"))
                return UploadedFileType.AUDIO;
            else if (lower.startsWith("video")) {
                return UploadedFileType.VIDEO;
            } else if(lower.startsWith("image")) {
                return UploadedFileType.IMAGE;
            }
        }
        return UploadedFileType.OTHER;
    }

    public UploadedFile uploadFile(UploadedFile.UploadedFileBuilder builder, MultipartFile file) {

        try {
            var hash = Crypto.calcSHA1(file);
            var model = builder
                    .checksum(hash)
                    .contentType(file.getContentType())
                    .size_bytes(file.getSize())
                    .name(StringUtils.cleanPath(file.getOriginalFilename()))
                    .type(getFileType(file.getContentType()))
                    .build();
            repo.save(model);
            file.transferTo(getFilePath(model));
            return model;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ApiException("Could not store file " + file.getOriginalFilename());
        }
    }

    public List<UploadedFileDto> findMyFiles(User user, int page, int count) {
        return repo.findByAuthor_Id(user.getId(), PageRequest.of(page, count, Sort.by(Sort.Direction.DESC, "uploadedAt")))
                .stream().map(UploadedFileDto::from).collect(Collectors.toList());
    }

    public UrlResource getUri(UploadedFile file) {
        try {
            return new UrlResource(getFilePath(file).toUri());
        }catch(Exception ex) {
            throw new ApiException("Invalid path");
        }
    }

    public UploadedFileRepository getRepo() {
        return repo;
    }
}