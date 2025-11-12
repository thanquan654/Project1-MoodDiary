package com.project1.smart_diary.dto.response;

import com.project1.smart_diary.enums.Emotion;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CanlendarEmotionResponse {
    private LocalDate  date;
    private Emotion emotion;
}
