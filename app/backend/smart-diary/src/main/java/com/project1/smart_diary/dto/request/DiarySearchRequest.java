package com.project1.smart_diary.dto.request;


import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;

@Getter
@Setter
@Builder
public class DiarySearchRequest {
//    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate fromDate;
//    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate toDate;

    private String emotion;
    private String keyword;
}
