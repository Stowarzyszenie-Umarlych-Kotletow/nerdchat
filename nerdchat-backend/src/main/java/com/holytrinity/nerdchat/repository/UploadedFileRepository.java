package com.holytrinity.nerdchat.repository;

import com.holytrinity.nerdchat.entity.UploadedFile;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UploadedFileRepository extends CrudRepository<UploadedFile, Integer> {
}
