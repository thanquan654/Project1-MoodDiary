package com.project1.smart_diary.dto.response;

import com.project1.smart_diary.enums.Emotion;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiaryResponse {
    private Long id;
    private String title;
    private String content;
    private String advice;
    private Emotion emotion;
    private List<String> mediaUrls;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}