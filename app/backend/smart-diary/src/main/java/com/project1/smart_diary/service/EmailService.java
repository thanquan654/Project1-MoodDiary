package com.project1.smart_diary.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
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
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);
            int status = response.getStatusCode();
            log.info("SendGrid response: status={}, body={}", status, response.getBody());

            if (status < 200 || status >= 300) {
                // xử lý non-2xx
                log.error("SendGrid gửi thất bại (status: {}) body: {}", status, response.getBody());
                throw new RuntimeException("Gửi email không thành công. SendGrid status=" + status);
            }

        } catch (IOException e) {
            log.error("Không thể gửi email đặt lại mật khẩu đến: {}", email, e);
            throw new RuntimeException("Gửi email không thành công.", e);
        }
    }
}
