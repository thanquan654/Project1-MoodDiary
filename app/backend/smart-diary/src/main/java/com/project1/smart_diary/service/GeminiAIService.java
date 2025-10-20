package com.project1.smart_diary.service;

import com.project1.smart_diary.config.GeminiApiConfig;
import com.project1.smart_diary.enums.Emotion;
import com.project1.smart_diary.exception.ApplicationException;
import com.project1.smart_diary.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
@Service
@Slf4j
public class GeminiAIService {
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private GeminiApiConfig geminiApiConfig;

    public Emotion predictTextEmotion(String input) {
        if (input == null || input.isBlank()) {
            log.error("Input is null or empty");
            throw new ApplicationException(ErrorCode.DATA_INPUT_AI_NULL);
        }
        String prompt = String.format(
                "Bạn là một chuyên gia phân tích cảm xúc tiếng Việt. Phân tích cảm xúc của đoạn văn sau (có thể chứa emoji): \"%s\". " +
                        "Trả về một trong các từ: HAPPY, SAD, NEUTRAL, ANXIOUS, ANGRY. nếu dữ liệu không đủ để phân tích hãy trả ra từ : UNSPECIFIED",
                input
        );
        try {
            String response = callGeminiAPI(prompt);
            return parseEmotionFromResponse(response);
        } catch (Exception e) {
            log.error("Error predicting text emotion: {}", e.getMessage());
//            throw new RuntimeException("Lỗi khi dự đoán cảm xúc: " + e.getMessage(), e);
            throw  new ApplicationException(ErrorCode.UNCATEGORIZEO_EXCEPTION_AI);
        }
    }
    private Emotion parseEmotionFromResponse(String response) {
        if (response == null || response.isBlank()) {
            return Emotion.NEUTRAL;
        }
        response = response.toLowerCase();

        if (response.contains("happy")) {
            return Emotion.HAPPY;
        } else if (response.contains("sad")) {
            return Emotion.SAD;
        } else if (response.contains("anxious")) {
            return Emotion.ANXIOUS;
        } else if (response.contains("angry")) {
            return Emotion.ANGRY;
        } else if (response.contains("unspecified")) {
            return Emotion.UNSPECIFIED;
        } else {
            return Emotion.NEUTRAL;
        }
    }

    private String callGeminiAPI(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        // BỎ Authorization header - Gemini sử dụng query parameter
        String apiKey = geminiApiConfig.getKey();
        log.info("Using API key: {}", apiKey != null ? apiKey.substring(0, 10) + "..." : "NULL");
        String requestBody = String.format(
                "{\"contents\": [{\"parts\": [{\"text\": \"%s\"}]}]}",
                prompt.replace("\"", "\\\"")
        );
        log.info("Request body: {}", requestBody);
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        try {
            String urlWithKey = geminiApiConfig.getEndpoints().get("text-generation") + "?key=" + apiKey;
            ResponseEntity<String> response = restTemplate.postForEntity(
                    urlWithKey,
                    request, String.class);
            log.info("Response status: {}", response.getStatusCode());
            log.info("Response body: {}", response.getBody());
            return response.getBody();
        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage());
            throw e;
        }
    }



}
