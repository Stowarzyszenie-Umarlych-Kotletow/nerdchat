package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.UploadedFile;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UploadedFileRepository extends PagingAndSortingRepository<UploadedFile, Integer> {
    List<UploadedFile> findByAuthor_Id(int userId, Pageable pageable);
}
