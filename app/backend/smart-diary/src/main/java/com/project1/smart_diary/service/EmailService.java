package com.project1.smart_diary.service;

import com.sendgrid.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Slf4j
@Service
public class EmailService {

    @Value("${app.ngrok.fontend-url-public}")
    private String fontendUrlPublic;

    @Value("${APP_MAIL_FROM}")
    private String fromEmail;

    @Value("${SENDGRID_API_KEY}")
    private String sendGridApiKey;

    public void sendResetPasswordEmail(String email, String token) {
        try {
            String resetUrl = fontendUrlPublic + "/reset-password?token=" + token;

            String emailBody = String.format("""
                Chào bạn,
                
                Bạn đã yêu cầu đặt lại mật khẩu cho Smart Diary.
                
                Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn:
                %s                   
                
                Liên kết này sẽ hết hạn trong 10 phút.
                
                Nếu bạn không yêu cầu đặt lại mật khẩu này, xin vui lòng bỏ qua email này.
                
                Trân trọng,
                Smart Diary Team
                """, resetUrl);

            Email from = new Email(fromEmail);
            Email to = new Email(email);
            Content content = new Content("text/plain", emailBody);
            Mail mail = new Mail(from, "Đặt lại mật khẩu - Smart Diary", to, content);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);
            log.info("SendGrid response: status={}, body={}", response.getStatusCode(), response.getBody());

        } catch (IOException e) {
            log.error("Không thể gửi email đặt lại mật khẩu đến: {}", email, e);
            throw new RuntimeException("Gửi email không thành công.");
        }
    }
}
