package com.project1.smart_diary.service;

import com.project1.smart_diary.converter.DiaryConverter;
import com.project1.smart_diary.dto.request.DiaryRequest;
import com.project1.smart_diary.dto.request.DiarySearchByDateAndEmotionRequest;
import com.project1.smart_diary.dto.request.DiarySearchRequest;
import com.project1.smart_diary.dto.request.DiaryUpdateRequest;
import com.project1.smart_diary.dto.response.CanlendarEmotionResponse;
import com.project1.smart_diary.dto.response.DiaryResponse;
import com.project1.smart_diary.entity.DiaryEntity;
import com.project1.smart_diary.entity.DiaryMedia;
import com.project1.smart_diary.entity.UserEntity;
import com.project1.smart_diary.enums.Emotion;
import com.project1.smart_diary.exception.ApplicationException;
import com.project1.smart_diary.exception.ErrorCode;
import com.project1.smart_diary.repository.DiaryRepository;
import com.project1.smart_diary.repository.UserRepository;
import com.project1.smart_diary.util.PromptQuestionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.mapstruct.ap.shaded.org.mapstruct.tools.gem.Gem;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class DiaryService {

    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final DiaryConverter diaryConverter;
    private final GeminiAIService geminiAIService;
    private final PromptQuestionUtil promptQuestionUtil;

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

    @Transactional
    public DiaryResponse updateDiary(Long id, DiaryUpdateRequest request) {
        UserEntity currentUser = getCurrentUser();

        DiaryEntity diary = diaryRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.DIARY_NOT_FOUND));
        if (!diary.getUser().getId().equals(currentUser.getId())) {
            throw new ApplicationException(ErrorCode.NOT_DIARY_OWNER);
        }
        validateDiaryRequestForUpdate(request);
        if (!hasChanges(diary, request)) {
            throw new ApplicationException(ErrorCode.NO_CHANGES_DETECTED);
        }
        if (StringUtils.hasText(request.getTitle())) {
            diary.setTitle(request.getTitle().trim());
        }
        if (StringUtils.hasText(request.getContent())) {
            String newContent = request.getContent().trim();
            if(!newContent.equals(diary.getContent())) {
                diary.setContent(newContent);
                Emotion emotion = geminiAIService.predictTextEmotion(request.getContent());
                String advice = geminiAIService.generateAdvice(request.getContent(), emotion);
                diary.setEmotion(emotion);
                diary.setAdvice(advice);
            }
        }
        processImages(diary, request);
//        if(!diary.getContent().equals(request.getContent())) {
//            diary.setContent(request.getContent());
//            Emotion emotion = geminiAIService.predictTextEmotion(request.getContent());
//            String advice = geminiAIService.generateAdvice(request.getContent(), emotion);
//            diary.setEmotion(emotion);
//            diary.setAdvice(advice);
//        }
        diary.setUpdatedAt(LocalDateTime.now());
        DiaryEntity saved = diaryRepository.save(diary);
        return diaryConverter.toResponse(saved);
    }

    private void validateDiaryRequestForUpdate(DiaryUpdateRequest req) {
        if (req.getTitle() != null && req.getTitle().trim().isEmpty()) {
            throw new ApplicationException(ErrorCode.DIARY_TITLE_REQUIRED);
        }
        if (req.getContent() != null && req.getContent().trim().isEmpty()) {
            throw new ApplicationException(ErrorCode.DIARY_CONTENT_REQUIRED);
        }
        if (req.getNewImages() != null) {
            for (MultipartFile file : req.getNewImages()) {
                if (!file.isEmpty()) {
                    validateImageFile(file);
                }
            }
        }
    }
    private void processImages(DiaryEntity diary, DiaryUpdateRequest req) {
        List<DiaryMedia> toKeep = new ArrayList<>();
        List<DiaryMedia> toDelete = new ArrayList<>();

        Set<Long> keepIds = req.getExistingImageIds() != null
                ? new HashSet<>(req.getExistingImageIds())
                : Collections.emptySet();

        for (DiaryMedia media : diary.getMedia()) {
            if (keepIds.contains(media.getId())) {
                toKeep.add(media);
            } else {
                toDelete.add(media);
            }
        }

        int keptCount = toKeep.size();
        int newCount = req.getNewImages() != null ? req.getNewImages().size() : 0;
        int totalAfter = keptCount + newCount;

        if (totalAfter > 5) {
            throw new ApplicationException(ErrorCode.MAX_TOTAL_IMAGES_EXCEEDED);
        }

        for (DiaryMedia media : toDelete) {
            cloudinaryService.deleteImage(media.getMediaUrl());
        }

        diary.getMedia().removeAll(toDelete);

        if (req.getNewImages() != null && !req.getNewImages().isEmpty()) {
            List<DiaryMedia> uploaded = uploadImages(req.getNewImages(), diary);
            diary.getMedia().addAll(uploaded);
        }

        log.info(" Final Media Count: Kept={}, New={}, Total={}",
                keptCount, newCount, totalAfter);
    }

    private boolean hasChanges(DiaryEntity diary, DiaryUpdateRequest req) {
        boolean textChanged =
                (req.getTitle() != null && !req.getTitle().equals(diary.getTitle())) ||
                        (req.getContent() != null && !req.getContent().equals(diary.getContent()));

        if (textChanged) return true;

        List<DiaryMedia> currentMedia = diary.getMedia();
        Set<Long> keepIds = req.getExistingImageIds() != null
                ? new HashSet<>(req.getExistingImageIds())
                : Collections.emptySet();

        boolean imageRemoved = keepIds.isEmpty() && !currentMedia.isEmpty();

        boolean imageChanged = !imageRemoved &&
                currentMedia.stream().anyMatch(m -> !keepIds.contains(m.getId()));

        boolean newImagesAdded = req.getNewImages() != null && !req.getNewImages().isEmpty();

        return imageRemoved || imageChanged || newImagesAdded;
    }

    public void deleteDiary(Long id) {
        UserEntity currentUser = getCurrentUser();

        DiaryEntity diary = diaryRepository.findById(id)
                .orElseThrow(() -> new ApplicationException(ErrorCode.DIARY_NOT_FOUND));

        if (!diary.getUser().getId().equals(currentUser.getId())) {
            throw new ApplicationException(ErrorCode.NOT_DIARY_OWNER);
        }

        boolean cloudinaryDeleteSuccess = deleteImagesFromCloudinary(diary);

        diaryRepository.delete(diary);
        log.info(" Diary deleted - ID: {}, User: {}", id, currentUser.getEmail());

        if (!cloudinaryDeleteSuccess) {
            log.warn(" Diary deleted but Cloudinary images may not be fully cleaned up - ID: {}", id);
            throw new ApplicationException(ErrorCode.CLOUDINARY_DELETE_FAILED);
        }

    }

    private boolean deleteImagesFromCloudinary(DiaryEntity diary) {
        if (diary.getMedia() == null || diary.getMedia().isEmpty()) {
            return true;
        }

        boolean allSuccess = true;
        for (DiaryMedia media : diary.getMedia()) {
            boolean success = cloudinaryService.deleteImageWithResult(media.getMediaUrl());

            if (success) {
            } else {
                allSuccess = false;
            }
        }
        return allSuccess;
    }

    public Map<String, Object> getTodayPrompt() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        boolean hasRecordedToday = hasRecordedDiaryToday(email);

        Map<String, Object> response = new HashMap<>();
        response.put("hasRecordedToday", hasRecordedToday);

        if (!hasRecordedToday) {
            String todayQuestion = promptQuestionUtil.getRandomQuestion();
            response.put("todayQuestion", todayQuestion);
        }

        return response;
    }

    private boolean hasRecordedDiaryToday(String email) {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);

        return diaryRepository.existsByUser_EmailAndCreatedAtBetween(
                email, startOfDay, endOfDay);
    }

    public List<CanlendarEmotionResponse> getEmotionByMonth(int year, int month){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        LocalDate from = LocalDate.of(year, month, 1);
        LocalDateTime fromDate = from.atStartOfDay();
        LocalDateTime toDate = from.plusMonths(1).atStartOfDay();
        List<DiaryEntity> diaryEntityList = diaryRepository.findByUser_EmailAndCreatedAtBetween(email, fromDate, toDate);
        Map<LocalDate, List<DiaryEntity>> diariesByDay = diaryEntityList
                .stream()
                .collect(Collectors.groupingBy(d -> d.getCreatedAt().toLocalDate()));
        Map<LocalDate, Emotion> res = new HashMap<>();
        for (Map.Entry<LocalDate, List<DiaryEntity>> entry : diariesByDay.entrySet()) {
            Map<Emotion, Long> countMap = entry.getValue()
                    .stream()
                    .collect(Collectors.groupingBy(DiaryEntity::getEmotion, Collectors.counting()));
            if (countMap.isEmpty()) {
                res.put(entry.getKey(), null);
                continue;
            }
            long maxCnt = countMap.values().stream().mapToLong(Long::longValue).max().orElse(0);
            List<Emotion> listEmotions = countMap
                    .entrySet()
                    .stream()
                    .filter(e -> e.getValue() == maxCnt)
                    .map(Map.Entry::getKey)
                    .toList();
            Emotion emotion;
            if (listEmotions.size() == 1) {
                emotion = listEmotions.get(0);
            } else {
                emotion = Emotion.NEUTRAL;
            }
            res.put(entry.getKey(), emotion);
        }
        List<CanlendarEmotionResponse> list = res
                .entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e-> CanlendarEmotionResponse
                        .builder()
                        .date(e.getKey())
                        .emotion(e.getValue())
                        .build())
                .toList();
        return list;
    }
}