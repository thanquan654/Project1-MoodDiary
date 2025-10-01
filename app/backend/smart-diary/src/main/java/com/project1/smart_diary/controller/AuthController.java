package com.project1.smart_diary.controller;

import com.nimbusds.jose.JOSEException;
import com.project1.smart_diary.dto.LoginGoogleDTO;
import com.project1.smart_diary.dto.request.LoginRequest;
import com.project1.smart_diary.dto.request.RefreshTokenRequest;
import com.project1.smart_diary.dto.request.UserCreateRequest;
import com.project1.smart_diary.dto.response.AuthenticationResponse;
import com.project1.smart_diary.dto.response.UserResponse;
import com.project1.smart_diary.service.AuthService;
import com.project1.smart_diary.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth API", description = "Xác thực người dùng")
public class AuthController {
    @Autowired
    private UserService userService;
    @Autowired
    private AuthService authService;
    @NonFinal
    @Value("${app.ngrok.fontend-url-public}")
    protected String Fontend_Url_public;

    @Operation(summary = "Đăng nhập với Email và mật khẩu")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Đăng nhập thành công",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AuthenticationResponse.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "Email sai định dạng, hoặc Email và mật khẩu rỗng"),
            @ApiResponse(responseCode = "401", description = "Emai hoăcj mật khẩu không đúng"),
            @ApiResponse(responseCode = "500", description = "Lỗi server khi xác thực, không thể xử lý yêu cầu")
    })
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.authenticate(loginRequest));
    }


    @Operation(summary = "Đăng kí với Email , mật khẩu và tên đầy đủ")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Đăng kí thành công",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = UserResponse.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "Email sai định dạng, hoặc Email, mật khẩu và tên rỗng"),
            @ApiResponse(responseCode = "409", description = "Emai đã tồn tại trong hệ thống"),
            @ApiResponse(responseCode = "500", description = "Lỗi server khi tạo user, không thể xử lý yêu cầu")
    })
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserCreateRequest userCreateRequest) {
        UserResponse userResponse = userService.createUser(userCreateRequest);
        return ResponseEntity.ok(userResponse);
    }

    @Operation(summary = "Đăng nhập nhanh với Google")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Đăng nhập thành công",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AuthenticationResponse.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "Không lấy được thông tin từ Google"),
            @ApiResponse(responseCode = "500", description = "Lỗi server khi xử lý thông tin Google login, không thể xử lý yêu cầu")
    })
    @GetMapping("/login/google")
    public void loginGoogle(@AuthenticationPrincipal OAuth2User principal, HttpServletResponse response) throws IOException {
        Map<String, Object> attributes = principal.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");
        String sub = (String) attributes.get("sub");
        //
        LoginGoogleDTO loginGoogleDTO = new LoginGoogleDTO();
        loginGoogleDTO.setEmail(email);
        loginGoogleDTO.setFullName(name);
        loginGoogleDTO.setAvatarUrl(picture);
        loginGoogleDTO.setCreatedAt(LocalDateTime.now());
        loginGoogleDTO.setProviderId(sub);
        userService.createUserWithGoogle(loginGoogleDTO);


        AuthenticationResponse authResponse = authService.loginWithGoogle(loginGoogleDTO);
        String token = authResponse.getToken();
        String frontendUrl = Fontend_Url_public + "/gg-login-success?token=" + token;
        response.sendRedirect(frontendUrl);
    }

    @Operation(summary = "Tạo mới token")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Tạo token mới thành công",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AuthenticationResponse.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "Access Token hoặc token không hợp lệ."),
            @ApiResponse(responseCode = "401", description = "Access Token  hết hạn hoặc bị từ chối"),
            @ApiResponse(responseCode = "500", description = "Lỗi server khi xử lí token, không thể xử lý yêu cầu")
    })
    @PostMapping("/refresh")
    public ResponseEntity<AuthenticationResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) throws ParseException, JOSEException {
        var res = authService.refreshToken(refreshTokenRequest);
        return ResponseEntity.ok(res);
    }

    @Operation(summary = "Đăng xuất tài khoản")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Đăng xuất thành công",
                    content = @Content(
                            mediaType = "text/plain",
                            schema = @Schema(example = "Đăng xuất thành công -> Trang chủ")
                    )
            ),
            @ApiResponse(responseCode = "500", description = "Lỗi server khi xử lí Logout, không thể xử lý yêu cầu")
    })
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        authService.logout(request);
        return ResponseEntity.ok("Logout successful");
    }
}
