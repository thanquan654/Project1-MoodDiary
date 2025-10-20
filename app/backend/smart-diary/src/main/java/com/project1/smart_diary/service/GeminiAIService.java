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
