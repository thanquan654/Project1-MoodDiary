package com.project1.smart_diary.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    private String message;
    private boolean isUserMessage;
}

