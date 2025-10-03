package com.project1.smart_diary.service;

import com.project1.smart_diary.converter.DiaryConverter;
import com.project1.smart_diary.dto.request.DiaryRequest;
import com.project1.smart_diary.dto.response.DiaryResponse;
import com.project1.smart_diary.entity.DiaryEntity;
import com.project1.smart_diary.entity.DiaryMedia;
import com.project1.smart_diary.entity.UserEntity;
import com.project1.smart_diary.exception.ApplicationException;
import com.project1.smart_diary.exception.ErrorCode;
import com.project1.smart_diary.repository.DiaryRepository;
import com.project1.smart_diary.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import java.util.ArrayList;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class DiaryService {

    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final DiaryConverter diaryConverter;

    public DiaryResponse createDiary(DiaryRequest request) {
        UserEntity currentUser = getCurrentUser();
        validateDiaryRequest(request);

        DiaryEntity diary = DiaryEntity.builder()
                .title(request.getTitle() != null ? request.getTitle() : "")
                .content(request.getContent())
                .emotion(null)
                .advice(null)
                .user(currentUser)
                .media(new ArrayList<>())
                .build();

        if (request.getNewImages() != null && !request.getNewImages().isEmpty()) {
            List<DiaryMedia> mediaList = uploadImages(request.getNewImages(), diary);
            diary.setMedia(mediaList);
        }

        DiaryEntity savedDiary = diaryRepository.save(diary);
        log.info("Da tao nhat ky moi - ID: {}, Anh: {}", savedDiary.getId(),
                diary.getMedia().size());

        return diaryConverter.toResponse(savedDiary);
    }

    private UserEntity getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ApplicationException(ErrorCode.UNAUTHENTICATED);
        }

        String email = authentication.getName();
        UserEntity user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ApplicationException(ErrorCode.EMAIL_NOT_EXISTED);
        }
        return user;
    }

    private void validateDiaryRequest(DiaryRequest request) {
        //validate title
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new ApplicationException(ErrorCode.DIARY_TITLE_REQUIRED);
        }


        // Validate nội dung
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new ApplicationException(ErrorCode.DIARY_CONTENT_REQUIRED);
        }

        // 🔥 SỬA LẠI: Validate số lượng ảnh - báo lỗi cụ thể
        if (request.getNewImages() != null && request.getNewImages().size() > 5) {
            throw new ApplicationException(ErrorCode.MAX_IMAGES_EXCEEDED);
        }

        // Validate từng ảnh
        if (request.getNewImages() != null) {
            for (MultipartFile image : request.getNewImages()) {
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


}
