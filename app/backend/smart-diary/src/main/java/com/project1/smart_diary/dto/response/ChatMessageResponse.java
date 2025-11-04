package com.project1.smart_diary.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    private String message;
    @JsonProperty("isUserMessage")
    private boolean isUserMessage;
}

