package com.project1.smart_diary.util;

import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class PromptQuestionUtil {

    private static final List<String> PROMPT_QUESTIONS = Arrays.asList(
            "Hôm nay điều gì khiến bạn mỉm cười?",
            "Điều gì làm bạn biết ơn trong ngày hôm nay?",
            "Khoảnh khắc đáng nhớ nhất hôm nay là gì?",
            "Bạn đã học được điều gì mới hôm nay?",
            "Điều gì làm bạn cảm thấy tự hào về bản thân?",
            "Thử thách lớn nhất bạn đối mặt hôm nay là gì?"
    );

    public String getRandomQuestion() {
        int randomIndex = ThreadLocalRandom.current().nextInt(PROMPT_QUESTIONS.size());
        return PROMPT_QUESTIONS.get(randomIndex);
    }
}
