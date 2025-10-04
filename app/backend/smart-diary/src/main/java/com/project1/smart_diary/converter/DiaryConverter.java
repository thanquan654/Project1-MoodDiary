package com.project1.smart_diary.converter;

import com.project1.smart_diary.dto.response.DiaryResponse;
import com.project1.smart_diary.dto.response.MediaResponse;
import com.project1.smart_diary.entity.DiaryEntity;
import com.project1.smart_diary.entity.DiaryMedia;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DiaryConverter {

    private final ModelMapper modelMapper;

    public DiaryResponse toResponse(DiaryEntity diary) {
        if (diary == null) {
            return null;
        }
        DiaryResponse response = modelMapper.map(diary, DiaryResponse.class);
        List<MediaResponse> mediaResponses = diary.getMedia().stream()
                .map(media -> MediaResponse.builder()
                        .id(media.getId())
                        .mediaUrl(media.getMediaUrl())
                        .build())
                .collect(Collectors.toList());
        response.setMedia(mediaResponses);
        return response;
    }

    public List<DiaryResponse> toResponseList(List<DiaryEntity> diaries) {
        if (diaries == null) {
            return new ArrayList<>();
        }
        return diaries.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}