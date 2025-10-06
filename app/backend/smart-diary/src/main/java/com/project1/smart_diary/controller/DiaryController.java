package com.project1.smart_diary.controller;

import com.project1.smart_diary.dto.request.DiaryRequest;
import com.project1.smart_diary.dto.request.DiarySearchByDateRequest;
import com.project1.smart_diary.dto.request.DiarySearchRequest;
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
    @GetMapping
    public ResponseEntity<ApiResponse<List<DiaryResponse>>> getUserDiaries() {
        List<DiaryResponse> responses = diaryService.getUserDiaries();
        String message = responses.isEmpty()
                ? "Bạn chưa có nhật ký nào"
                : "Lấy danh sách nhật ký thành công";
        ApiResponse<List<DiaryResponse>> apiResponse = ApiResponse.<List<DiaryResponse>>builder()
                .message(message)
                .data(responses)
                .build();
        return ResponseEntity.ok(apiResponse);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DiaryResponse>> getDiaryDetail(@PathVariable Long id) {
        DiaryResponse response = diaryService.getDiaryDetail(id);

        ApiResponse<DiaryResponse> apiResponse = ApiResponse.<DiaryResponse>builder()
                .message("Lấy thông tin nhật ký thành công")
                .data(response)
                .build();

        return ResponseEntity.ok(apiResponse);
    }
    @GetMapping("/search")
    public ResponseEntity<List<DiaryResponse>> searchDiary(
            @RequestParam(value = "fromDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(value = "toDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(value = "emotion", required = false) String emotion) {
        DiarySearchRequest diarySearchRequest = new DiarySearchRequest();
        diarySearchRequest.setFromDate(fromDate);
        diarySearchRequest.setToDate(toDate);
        diarySearchRequest.setEmotion(emotion);
        return ResponseEntity.ok(diaryService.searchDiary(diarySearchRequest));
    }
}
