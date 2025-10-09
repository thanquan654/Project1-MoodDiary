package com.project1.smart_diary.repository.custom.impl;

import com.project1.smart_diary.dto.request.DiarySearchRequest;
import com.project1.smart_diary.entity.DiaryEntity;
import com.project1.smart_diary.repository.custom.DiaryRepositoryCustom;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class DiaryRepositoryImpl implements DiaryRepositoryCustom {
    @Override
    public List<DiaryEntity> searchDiary(String email, DiarySearchRequest diarySearchRequest) {
        return List.of();
    }
}
