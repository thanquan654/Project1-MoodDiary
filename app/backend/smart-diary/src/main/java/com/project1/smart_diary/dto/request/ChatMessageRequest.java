package com.project1.smart_diary.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageRequest {
    private String message;
    @JsonProperty("isUserMessage")
    private boolean isUserMessage;
}
