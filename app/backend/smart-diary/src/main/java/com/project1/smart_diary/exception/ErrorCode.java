package com.project1.smart_diary.exception;


import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZEO_EXCEPTION(9999, "uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1002, "username is invalid", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1003, "password is invalid", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1004, "Người dùng chưa xác thực", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1005, "you to not add permission", HttpStatus.FORBIDDEN),
    USER_NOT_FOUND(1006, "User not found", HttpStatus.NOT_FOUND),
    EMAIL_AND_PASSWORD_NOT_EXISTED(1007, "Email và mật khẩu không chính xác.", HttpStatus.UNAUTHORIZED),
    EMAIL_EXISTED(1008, "Email đã tồn tại.", HttpStatus.CONFLICT),
    EMAIL_NOT_EXISTED(1009, "Email không chính xác.", HttpStatus.UNAUTHORIZED),
    PASSWORD_NOT_EXISTED(2000, "Mật khẩu không chính xác.", HttpStatus.UNAUTHORIZED),
    EMAIL_NOT_FOUND(2001, "Email không tồn tại.", HttpStatus.NOT_FOUND),
    PASSWORD_MISMATCH(2002, "Mật khẩu và xác nhận mật khẩu không khớp.", HttpStatus.BAD_REQUEST),
    INVALID_RESET_TOKEN(2003, "Mã đặt lại không hợp lệ hoặc đã hết hạn.", HttpStatus.BAD_REQUEST),
    DIARY_TITLE_REQUIRED(2004, "không để trống tiêu đề nhật ký", HttpStatus.BAD_REQUEST),
    DIARY_CONTENT_REQUIRED(2005, "không để trống nội dung nhật ký", HttpStatus.BAD_REQUEST),
    MAX_IMAGES_EXCEEDED(2006, "Chỉ được upload tối đa 5 ảnh", HttpStatus.BAD_REQUEST),
    IMAGE_SIZE_EXCEEDED(2007, "Dung lượng ảnh không được vượt quá 10MB", HttpStatus.PAYLOAD_TOO_LARGE),
    INVALID_IMAGE_FORMAT(2008, "Chỉ hỗ trợ định dạng .jpg, .png", HttpStatus.UNSUPPORTED_MEDIA_TYPE),

    DATE_NULL(3001, "không được để trống cả fromDate và toDate", HttpStatus.BAD_REQUEST),
    DIARY_NOT_FOUND(3002, "Không tìm thấy nhật kí", HttpStatus.NOT_FOUND),
    INVALID_DATE_FORMAT(3003, "Định dạng ngày không hợp lệ. Vui lòng nhập theo định dạng yyyy-MM-dd.", HttpStatus.BAD_REQUEST),
    INVALID_EMOTION(3004, "Emotion không hợp lệ. Vui lòng nhập các từ khóa như: Vui, Buồn, Lo lắng, Tức giận, Trung tính.", HttpStatus.BAD_REQUEST),
    EMOTION_NULL(3005, "Không được để trống cảm xúc, vui lòng nhập cảm xúc để tìm kiếm.", HttpStatus.BAD_REQUEST),
    ;

    ErrorCode(int code, String message, HttpStatusCode httpStatusCode) {
        this.message = message;
        this.code = code;
        this.httpStatusCode = httpStatusCode;
    }

    private int code;
    private String message;
    private HttpStatusCode httpStatusCode;

}