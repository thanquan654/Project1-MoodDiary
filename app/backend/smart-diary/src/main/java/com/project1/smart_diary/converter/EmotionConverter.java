package com.project1.smart_diary.converter;

import com.project1.smart_diary.enums.Emotion;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import lombok.extern.slf4j.Slf4j;

@Converter(autoApply = true)
@Slf4j
public class EmotionConverter implements AttributeConverter<Emotion, String> {

    @Override
    public String convertToDatabaseColumn(Emotion emotion) {
        if (emotion == null) {
            return null;
        }
        return emotion.getDescription(); // Lưu description vào DB
    }

    @Override
    public Emotion convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }

        for (Emotion e : Emotion.values()) {
            if (e.getDescription().equals(dbData)) {
                return e;
            }
        }
//        throw new IllegalArgumentException("Unknown description: " + dbData);
        log.warn("⚠️ Unknown emotion in database: '{}'", dbData);
        return null;
    }
}
