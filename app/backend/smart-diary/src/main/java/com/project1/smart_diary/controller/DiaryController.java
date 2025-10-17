package com.project1.smart_diary.controller;

import com.project1.smart_diary.dto.request.DiaryRequest;
import com.project1.smart_diary.dto.request.DiarySearchByDateAndEmotionRequest;
import com.project1.smart_diary.dto.request.DiarySearchRequest;
import com.project1.smart_diary.dto.request.DiaryUpdateRequest;
import com.project1.smart_diary.dto.response.ApiResponse;
import com.project1.smart_diary.dto.response.DiaryResponse;
import com.project1.smart_diary.service.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
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

    //    @GetMapping("/search/date")
//    public ResponseEntity<List<DiaryResponse>> searchDiaryByDate(
//            @RequestParam(value = "fromDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
//            @RequestParam(value = "toDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
//        DiarySearchByDateRequest diarySearchByDateRequest = new DiarySearchByDateRequest();
//        diarySearchByDateRequest.setFromDate(fromDate);
//        diarySearchByDateRequest.setToDate(toDate);
//        return ResponseEntity.ok(diaryService.searchDiaryByDate(diarySearchByDateRequest));
//    }
//    @GetMapping("/search/emotion")
//    public ResponseEntity<List<DiaryResponse>> searchDiaryByEmotion(@RequestParam(value = "emotion", required = false) String emotion){
//        return  ResponseEntity.ok(diaryService.searchDiaryByEmotion(emotion));
//    }
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

    //    @GetMapping("/search")
//    public ResponseEntity<ApiResponse<List<DiaryResponse>>> searchDiary(
//            @RequestParam(value = "fromDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
//            @RequestParam(value = "toDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
//            @RequestParam(value = "emotion", required = false) String emotion) {
//        DiarySearchByDateAndEmotionRequest diarySearchRequest = new DiarySearchByDateAndEmotionRequest();
//        diarySearchRequest.setFromDate(fromDate);
//        diarySearchRequest.setToDate(toDate);
//        diarySearchRequest.setEmotion(emotion);
//        ApiResponse<List<DiaryResponse>> res = ApiResponse.<List<DiaryResponse>>builder()
//                .message("Tìm kiếm thành công")
//                .data(diaryService.searchDiaryByDateAndEmotion(diarySearchRequest))
//                .build();
//        return ResponseEntity.ok(res);
//    }
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<DiaryResponse>>> searchDiary(
//            @ModelAttribute DiarySearchRequest diarySearchRequest
            @RequestParam(value = "fromDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(value = "toDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(value = "emotion", required = false) String emotion,
            @RequestParam(value = "keyword", required = false) String keyword){
        DiarySearchRequest diarySearchRequest = DiarySearchRequest.builder()
                .fromDate(fromDate)
                .toDate(toDate)
                .emotion(emotion)
                .keyword(keyword)
                .build();
        ApiResponse<List<DiaryResponse>> res = ApiResponse.<List<DiaryResponse>>builder()
                .message("Tìm kiếm thành công")
                .data(diaryService.searchDiary(diarySearchRequest))
                .build();
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DiaryResponse>> updateDiary(
            @PathVariable Long id,
            @ModelAttribute DiaryUpdateRequest request) {
        DiaryResponse response = diaryService.updateDiary(id, request);

        ApiResponse<DiaryResponse> apiResponse = ApiResponse.<DiaryResponse>builder()
                .message("Cập nhật thành công!")
                .data(response)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteDiary(@PathVariable Long id) {
        diaryService.deleteDiary(id);

        ApiResponse<String> apiResponse = ApiResponse.<String>builder()
                .message("Xóa thành công")
                .data(null)
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
