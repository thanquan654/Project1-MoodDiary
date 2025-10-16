package com.project1.smart_diary.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) throws IOException {
        try {
            if (file == null || file.isEmpty()) {
                throw new IOException("Tep tin khong ton tai hoac rong");
            }
            String contentType = file.getContentType();
            if (contentType == null ||
                    (!contentType.equals("image/jpeg") &&
                            !contentType.equals("image/png") &&
                            !contentType.equals("image/jpg"))) {
                throw new IOException("Dinh dang anh khong hop le: " + contentType);
            }
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "image",
                            "folder", "diary_images",
                            "public_id", "diary_" + System.currentTimeMillis()
                    )
            );
            String imageUrl = uploadResult.get("secure_url").toString();
            return imageUrl;
        } catch (Exception e) {
            log.error("Loi khi tai anh: {}", e.getMessage());
            throw new IOException("Khong the tai anh len Cloudinary: " + e.getMessage(), e);
        }
    }

    public void deleteImage(String imageUrl) {
        try {
            String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            String publicId = "diary_images/" + fileName.substring(0, fileName.lastIndexOf("."));

            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Đã xóa ảnh Cloudinary: {}", publicId);
        } catch (Exception e) {
            log.error("Không thể xóa ảnh Cloudinary: {}", e.getMessage());
        }
    }

}