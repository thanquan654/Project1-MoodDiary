package com.project1.smart_diary.converter;

import com.project1.smart_diary.dto.response.DiaryResponse;
import com.project1.smart_diary.entity.DiaryEntity;
import com.project1.smart_diary.entity.DiaryMedia;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class DiaryConverter {

    public DiaryResponse toResponse(DiaryEntity diary) {
        if (diary == null) {
            return null;
        }

        List<String> mediaUrls = diary.getMedia().stream()
                .map(DiaryMedia::getMediaUrl)
                .collect(Collectors.toList());

        return DiaryResponse.builder()
                .id(diary.getId())
                .title(diary.getTitle())
                .content(diary.getContent())
                .advice(diary.getAdvice())
                .emotion(diary.getEmotion())
                .mediaUrls(mediaUrls)
                .createdAt(diary.getCreatedAt())
                .updatedAt(diary.getUpdatedAt())
                .build();
    }

    // Có thể thêm các method convert khác nếu cần
    public List<DiaryResponse> toResponseList(List<DiaryEntity> diaries) {
        if (diaries == null) {
            return new ArrayList<>();
        }

        return diaries.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}