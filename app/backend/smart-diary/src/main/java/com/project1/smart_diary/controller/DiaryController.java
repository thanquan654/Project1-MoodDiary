package com.project1.smart_diary.controller;

import com.project1.smart_diary.dto.request.DiaryRequest;
import com.project1.smart_diary.dto.response.ApiResponse;
import com.project1.smart_diary.dto.response.DiaryResponse;
import com.project1.smart_diary.service.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/diaries")
@RequiredArgsConstructor
public class DiaryController {
    private final DiaryService diaryService;

    @PostMapping
    public ResponseEntity<ApiResponse<DiaryResponse>> createDiary(@ModelAttribute DiaryRequest request) {
        DiaryResponse response = diaryService.createDiary(request);
        ApiResponse<DiaryResponse> apiResponse = ApiResponse.<DiaryResponse>builder()
                .message("Lưu thành công!")
                .data(response)
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
