package com.PcDirac_backend.PcDirac_backend.user;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendActivationEmail(String toEmail, String token) throws MessagingException {
        String activationLink = "https://api.pcdirac.com/api/users/activate?token=" + token;

        // Build HTML email with button
        String htmlContent = "<html>" +
                "<body style='font-family: Arial, sans-serif;'>" +
                "<h2>Bienvenue chez PcDirac 🎉</h2>" +
                "<p>Merci de vous être inscrit. Veuillez cliquer sur le bouton ci-dessous pour activer votre compte :</p>" +
                "<a href='" + activationLink + "' " +
                "style='display: inline-block; padding: 10px 20px; margin: 20px 0; " +
                "font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;'>Activer mon compte</a>" +
                "<p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>" +
                "<p><a href='" + activationLink + "'>" + activationLink + "</a></p>" +
                "<br><p>Merci,<br>L'équipe PcDirac</p>" +
                "</body>" +
                "</html>";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(toEmail);
        helper.setSubject("Activation de votre compte");
        helper.setText(htmlContent, true); // true = enable HTML

        mailSender.send(message);
    }
}
