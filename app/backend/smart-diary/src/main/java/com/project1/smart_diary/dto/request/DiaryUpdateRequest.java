package com.project1.smart_diary.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class DiaryUpdateRequest {
    private String title;
    private String content;
    private List<MultipartFile> newImages;
    private List<Long> existingImageIds;
}