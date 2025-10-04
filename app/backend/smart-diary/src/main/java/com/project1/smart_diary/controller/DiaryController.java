package com.project1.smart_diary.controller;

import com.project1.smart_diary.dto.request.DiaryRequest;
import com.project1.smart_diary.dto.request.DiarySearchByDateRequest;
import com.project1.smart_diary.dto.response.ApiResponse;
import com.project1.smart_diary.dto.response.DiaryResponse;
import com.project1.smart_diary.service.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

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
    @GetMapping("/search/date")
    public ResponseEntity<List<DiaryResponse>> searchDiaryByDate(
            @RequestParam(value = "fromDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(value = "toDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        DiarySearchByDateRequest diarySearchByDateRequest = new DiarySearchByDateRequest();
        diarySearchByDateRequest.setFromDate(fromDate);
        diarySearchByDateRequest.setToDate(toDate);
        return ResponseEntity.ok(diaryService.searchDiaryByDate(diarySearchByDateRequest));
    }
    @GetMapping("/search/emotion")
    public ResponseEntity<List<DiaryResponse>> searchDiaryByEmotion(@RequestParam(value = "emotion", required = false) String emotion){
        return  ResponseEntity.ok(diaryService.searchDiaryByEmotion(emotion));
    }
}
