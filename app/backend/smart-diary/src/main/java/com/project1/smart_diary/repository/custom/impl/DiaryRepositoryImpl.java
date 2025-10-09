package com.project1.smart_diary.repository.custom.impl;

import com.project1.smart_diary.dto.request.DiarySearchRequest;
import com.project1.smart_diary.entity.DiaryEntity;
import com.project1.smart_diary.enums.Emotion;
import com.project1.smart_diary.exception.ApplicationException;
import com.project1.smart_diary.exception.ErrorCode;
import com.project1.smart_diary.repository.custom.DiaryRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@Slf4j
public class DiaryRepositoryImpl implements DiaryRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    private Emotion fromDescription(String value) {
        for (Emotion e : Emotion.values()) {
            if (e.getDescription().equalsIgnoreCase(value.trim())) {
                return e;
            }
        }
        throw new ApplicationException(ErrorCode.INVALID_EMOTION);
    }

    @Override
    public List<DiaryEntity> searchDiary(String email, DiarySearchRequest diarySearchRequest) {
        StringBuilder jpql = new StringBuilder("select d from DiaryEntity d where d.user.email =: email ");
        Map<String, Object> params = new HashMap<>();
        params.put("email", email);
        if (diarySearchRequest.getEmotion() != null && !diarySearchRequest.getEmotion().trim().isEmpty()) {
            Emotion emotion = fromDescription(diarySearchRequest.getEmotion());
            jpql.append("and d.emotion =: emotion ");
            params.put("emotion", emotion);
        }
        LocalDateTime fromDate = null;
        LocalDateTime toDate = null;
        if (diarySearchRequest.getFromDate() != null) {
            fromDate = diarySearchRequest.getFromDate().atStartOfDay();
        }
        if (diarySearchRequest.getToDate() != null) {
            toDate = diarySearchRequest.getToDate().plusDays(1).atStartOfDay().minusNanos(1);
        }
        if (fromDate != null && toDate != null) {
            jpql.append("and d.createdAt between :fromDate and :toDate ");
            params.put("fromDate", fromDate);
            params.put("toDate", toDate);
        } else if (fromDate != null) {
            jpql.append("and d.createdAt >= :fromDate ");
            params.put("fromDate", fromDate);
        } else if (toDate != null) {
            jpql.append("and d.createdAt <= :toDate ");
            params.put("toDate", toDate);
        }
        log.info("jpql search with date: {} ", jpql);

        if (diarySearchRequest.getKeyword() != null && !diarySearchRequest.getKeyword().trim().isEmpty()) {
            jpql.append("and (lower(d.title) like lower(:keyword) or lower(d.content) like lower(:keyword)) ");
            params.put("keyword", "%" + diarySearchRequest.getKeyword().trim().toLowerCase() + "%");
        }
        jpql.append("order by d.createdAt desc");
        TypedQuery<DiaryEntity> query = entityManager.createQuery(jpql.toString(), DiaryEntity.class);
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }
        return query.getResultList();
    }
}
