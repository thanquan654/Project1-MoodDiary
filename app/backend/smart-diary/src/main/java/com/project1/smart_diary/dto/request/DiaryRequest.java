package com.project1.smart_diary.dto.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
public class DiaryRequest {
    private String title;
    private String content;
    private List<MultipartFile> images;
}