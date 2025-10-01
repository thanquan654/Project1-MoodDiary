package com.project1.smart_diary.controller;

import com.project1.smart_diary.dto.request.ForgotPasswordRequest;
import com.project1.smart_diary.dto.request.ResetPasswordRequest;
import com.project1.smart_diary.service.ForgotPasswordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Forgot Password API", description = "Quên mật khẩu và đặt lại mật khẩu")
public class ForgotPasswordController {

    private final ForgotPasswordService forgotPasswordService;

    @Operation(
            summary = "Yêu cầu đặt lại mật khẩu",
            description = "Người dùng gửi email, nếu tồn tại trong hệ thống thì sẽ nhận được liên kết đặt lại mật khẩu."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Nếu email tồn tại, một liên kết đặt lại mật khẩu đã được gửi.",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(example = "{ \"message\": \"Nếu email tồn tại, một liên kết đặt lại mật khẩu đã được gửi.\" }")
                    )
            ),
            @ApiResponse(responseCode = "400", description = "Request không hợp lệ"),
            @ApiResponse(responseCode = "500", description = "Lỗi server khi gửi email")
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        forgotPasswordService.sendResetPasswordEmail(request);

        return ResponseEntity.ok(Map.of(
                "message", "Nếu email tồn tại, một liên kết đặt lại mật khẩu đã được gửi."
        ));
    }

    @Operation(
            summary = "Đặt lại mật khẩu",
            description = "Người dùng cung cấp token reset và mật khẩu mới để đặt lại mật khẩu."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Đặt lại mật khẩu thành công",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(example = "{ \"message\": \"Mật khẩu đã được đặt lại thành công.\" }")
                    )
            ),
            @ApiResponse(responseCode = "400", description = "Request không hợp lệ hoặc token reset không hợp lệ"),
            @ApiResponse(responseCode = "401", description = "Token reset hết hạn hoặc không hợp lệ"),
            @ApiResponse(responseCode = "500", description = "Lỗi server khi đặt lại mật khẩu")
    })
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        forgotPasswordService.resetPassword(request);

        return ResponseEntity.ok(Map.of(
                "message", "Mật khẩu đã được đặt lại thành công."
        ));
    }
}
