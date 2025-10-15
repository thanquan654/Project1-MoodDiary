package com.project1.smart_diary.service;

import com.project1.smart_diary.converter.DiaryConverter;
import com.project1.smart_diary.dto.request.DiaryRequest;
import com.project1.smart_diary.dto.request.DiarySearchByDateAndEmotionRequest;
import com.project1.smart_diary.dto.request.DiarySearchRequest;
import com.project1.smart_diary.dto.response.DiaryResponse;
import com.project1.smart_diary.entity.DiaryEntity;
import com.project1.smart_diary.entity.DiaryMedia;
import com.project1.smart_diary.entity.UserEntity;
import com.project1.smart_diary.enums.Emotion;
import com.project1.smart_diary.exception.ApplicationException;
import com.project1.smart_diary.exception.ErrorCode;
import com.project1.smart_diary.repository.DiaryRepository;
import com.project1.smart_diary.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import java.time.LocalDateTime;
import java.util.ArrayList;

import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class DiaryService {

    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final DiaryConverter diaryConverter;
    private final GeminiAIService geminiAIService;

    public DiaryResponse createDiary(DiaryRequest request) {
        UserEntity currentUser = getCurrentUser();
        validateDiaryRequest(request);

        Emotion emotion = geminiAIService.predictTextEmotion(request.getContent());
        String advice = geminiAIService.generateAdvice(request.getContent(), emotion);
        DiaryEntity diary = DiaryEntity.builder()
                .title(request.getTitle() != null ? request.getTitle() : "")
                .content(request.getContent())
                .emotion(emotion)
                .advice(advice)
                .user(currentUser)
                .media(new ArrayList<>())
                .build();

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            List<DiaryMedia> mediaList = uploadImages(request.getImages(), diary);
            diary.setMedia(mediaList);
        }

        DiaryEntity savedDiary = diaryRepository.save(diary);
        log.info("Da tao nhat ky moi - ID: {}, Anh: {}", savedDiary.getId(),
                diary.getMedia().size());

        return diaryConverter.toResponse(savedDiary);
    }

    private UserEntity getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ApplicationException(ErrorCode.EMAIL_NOT_EXISTED);
        }
        return user;
    }

    private void validateDiaryRequest(DiaryRequest request) {
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new ApplicationException(ErrorCode.DIARY_TITLE_REQUIRED);
        }
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new ApplicationException(ErrorCode.DIARY_CONTENT_REQUIRED);
        }
        if (request.getImages() != null && request.getImages().size() > 5) {
            throw new ApplicationException(ErrorCode.MAX_IMAGES_EXCEEDED);
        }

        // Validate từng ảnh
        if (request.getImages() != null) {
            for (MultipartFile image : request.getImages()) {
                if (!image.isEmpty()) {
                    validateImageFile(image);
                }
            }
        }
    }

    private void validateImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null ||
                (!contentType.equals("image/jpeg") && !contentType.equals("image/png") && !contentType.equals("image/jpg"))) {
            throw new ApplicationException(ErrorCode.INVALID_IMAGE_FORMAT);
        }
    }

    private List<DiaryMedia> uploadImages(List<MultipartFile> newImages, DiaryEntity diary) {
        List<DiaryMedia> mediaList = new ArrayList<>();

        if (newImages == null || newImages.isEmpty()) {
            return mediaList;
        }
        for (MultipartFile image : newImages) {
            if (!image.isEmpty()) {
                try {
                    String imageUrl = cloudinaryService.uploadImage(image);

                    DiaryMedia media = DiaryMedia.builder()
                            .mediaUrl(imageUrl)
                            .diary(diary)
                            .build();
                    mediaList.add(media);
                } catch (IOException e) {
                    log.error("Loi upload anh {}: {}", image.getOriginalFilename(), e.getMessage());
                }
            }
        }
        return mediaList;
    }


    private Emotion fromDescription(String value) {
        for (Emotion e : Emotion.values()) {
            if (e.getDescription().equalsIgnoreCase(value.trim())) {
                return e;
            }
        }
        throw new ApplicationException(ErrorCode.INVALID_EMOTION);
    }

    public List<DiaryResponse> getUserDiaries() {
        UserEntity currentUser = getCurrentUser();
        List<DiaryEntity> diaries = diaryRepository.findByUser_EmailOrderByCreatedAtDesc(currentUser.getEmail());
        return diaryConverter.toResponseList(diaries);
    }

    public DiaryResponse getDiaryDetail(Long id) {
        UserEntity currentUser = getCurrentUser();

        DiaryEntity diary = diaryRepository.findById(id)
                .orElseThrow(() -> {
                    return new ApplicationException(ErrorCode.DIARY_NOT_FOUND);
                });
        if (!diary.getUser().getId().equals(currentUser.getId())) {
            throw new ApplicationException(ErrorCode.NOT_DIARY_OWNER);
        }

        return diaryConverter.toResponse(diary);
    }

    @Transactional(readOnly = true)
    public List<DiaryResponse> searchDiaryByDateAndEmotion(DiarySearchByDateAndEmotionRequest rq) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Emotion emotion;
        List<DiaryEntity> diaryEntityList = new ArrayList<>();
        if (rq.getToDate() != null && rq.getFromDate() != null && rq.getEmotion() != null) {
            LocalDateTime fromDateTime = rq.getFromDate().atStartOfDay();
            LocalDateTime toDateTime = rq.getToDate().plusDays(1).atStartOfDay().minusNanos(1);
            emotion = fromDescription(rq.getEmotion());
            diaryEntityList = diaryRepository.findByUser_EmailAndEmotionAndCreatedAtBetween(email, emotion, fromDateTime, toDateTime);
        } else if (rq.getToDate() != null && rq.getFromDate() != null) {
            LocalDateTime fromDateTime = rq.getFromDate().atStartOfDay();
            LocalDateTime toDateTime = rq.getToDate().plusDays(1).atStartOfDay().minusNanos(1);
            diaryEntityList = diaryRepository.findByUser_EmailAndCreatedAtBetween(email, fromDateTime, toDateTime);
        } else if (rq.getFromDate() != null && rq.getEmotion() != null) {
            LocalDateTime fromDateTime = rq.getFromDate().atStartOfDay();
            emotion = fromDescription(rq.getEmotion());
            diaryEntityList = diaryRepository.findByUser_EmailAndEmotionAndCreatedAtAfter(email, emotion, fromDateTime);
        } else if (rq.getToDate() != null && rq.getEmotion() != null) {
            LocalDateTime toDateTime = rq.getToDate().plusDays(1).atStartOfDay().minusNanos(1);
            emotion = fromDescription(rq.getEmotion());
            diaryEntityList = diaryRepository.findByUser_EmailAndEmotionAndCreatedAtBefore(email, emotion, toDateTime);
        } else if (rq.getFromDate() != null) {
            LocalDateTime fromDateTime = rq.getFromDate().atStartOfDay();
            diaryEntityList = diaryRepository.findByUser_EmailAndCreatedAtAfter(email, fromDateTime);
        } else if (rq.getToDate() != null) {
            LocalDateTime toDateTime = rq.getToDate().plusDays(1).atStartOfDay().minusNanos(1);
            diaryEntityList = diaryRepository.findByUser_EmailAndCreatedAtBefore(email, toDateTime);

        } else if (rq.getEmotion() != null) {
            emotion = fromDescription(rq.getEmotion());
            diaryEntityList = diaryRepository.findByUser_EmailAndEmotion(email, emotion);
        } else {
            throw new ApplicationException(ErrorCode.DATE_AND_EMOTION_NULL);
        }
        if (diaryEntityList == null || diaryEntityList.isEmpty()) {
            throw new ApplicationException(ErrorCode.DIARY_NOT_FOUND);
        }
        List<DiaryResponse> res = new ArrayList<>();
        for (DiaryEntity diaryEntity : diaryEntityList) {
            DiaryResponse diaryResponse = diaryConverter.toResponse(diaryEntity);
            res.add(diaryResponse);
        }
        return res;
    }
    public List<DiaryResponse> searchDiary(DiarySearchRequest diarySearchRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<DiaryEntity> diaryEntityList = diaryRepository.searchDiary(email, diarySearchRequest);
        if (diaryEntityList == null || diaryEntityList.isEmpty()) {
            throw new ApplicationException(ErrorCode.DIARY_NOT_FOUND);
        }
        return diaryEntityList.stream()
                .map(diaryConverter::toResponse)
                .toList();
    }
}