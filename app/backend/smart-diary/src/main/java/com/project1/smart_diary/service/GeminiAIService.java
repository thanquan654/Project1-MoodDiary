package com.project1.smart_diary.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project1.smart_diary.config.GeminiApiConfig;
import com.project1.smart_diary.enums.Emotion;
import com.project1.smart_diary.exception.ApplicationException;
import com.project1.smart_diary.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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
            return Emotion.NEUTRAL; // fallback mặc định
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
            // Thêm API key vào query parameter thay vì header
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

    public String generateAdvice(String text, Emotion emotion) {
        String prompt = String.format("Hãy đóng vai một người bạn tâm lý, hiểu biết và luôn mang năng lượng tích cực" +
                        "Dựa trên đoạn văn và cảm xúc của người viết " +
                        "hãy tạo lời khuyên ngắn gọn và tích cực cho nội dung: " +
                        "'%s' với cảm xúc: %s. Trả về lời khuyên khoảng dưới 100 từ.",
                text, emotion.getDescription());

        try {
            String response = callGeminiAPI(prompt);
            String extractedText = extractTextFromResponse(response);
            return extractedText;
        } catch (Exception e) {
            log.error("Error generating advice: {}", e.getMessage());
            return "Hãy giữ tinh thần tích cực và tiếp tục cố gắng!";
        }
    }
    private final ObjectMapper objectMapper = new ObjectMapper();
    private String extractTextFromResponse(String jsonResponse) {
        try {
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            JsonNode candidatesNode = rootNode.path("candidates");
            if (candidatesNode.isArray() && candidatesNode.size() > 0) {
                JsonNode firstCandidate = candidatesNode.get(0);
                JsonNode contentNode = firstCandidate.path("content");
                JsonNode partsNode = contentNode.path("parts");

                if (partsNode.isArray() && partsNode.size() > 0) {
                    JsonNode firstPart = partsNode.get(0);
                    JsonNode textNode = firstPart.path("text");

                    if (!textNode.isMissingNode()) {
                        String extractedText = textNode.asText().trim();
                        log.info("Extracted text: {}", extractedText);
                        return extractedText;
                    }
                }
            }

            log.warn("Could not extract text from response: {}", jsonResponse);
            return "Không thể trích xuất nội dung từ phản hồi AI.";

        } catch (Exception e) {
            log.error("Error parsing JSON response: {}", e.getMessage());
            return "Lỗi khi xử lý phản hồi từ AI: " + e.getMessage();
        }
    }
}
