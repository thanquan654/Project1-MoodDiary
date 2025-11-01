package com.project1.smart_diary.service;

import com.project1.smart_diary.entity.DiaryEntity;
import com.project1.smart_diary.entity.UserEntity;
import com.project1.smart_diary.repository.DiaryRepository;
import com.project1.smart_diary.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final DiaryRepository diaryRepository;
    private final GeminiAIService geminiAIService;
    private final UserRepository userRepository;

    private String converterContext(List<DiaryEntity>  diaryEntities, String email) {
//        UserEntity userEntity = userRepository.findByEmail(email);
        List<DiaryEntity> diaries = diaryRepository.findTop5ByUser_EmailOrderByCreatedAtDesc(email);
        StringBuilder contextBuilder = new StringBuilder();

        for (DiaryEntity diary : diaries) {
            contextBuilder.append("- Tiêu đề: ").append(diary.getTitle()).append("\n")
                    .append("  Nội dung: ").append(diary.getContent()).append("\n")
                    .append("  Ngày tạo: ").append(diary.getCreatedAt()).append("\n\n");
        }
        return contextBuilder.toString();
    }
}
