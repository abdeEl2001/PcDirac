package com.PcDirac_backend.PcDirac_backend.user;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Utilisateur introuvable");
        }

        User user = userOpt.get();
        String token = UUID.randomUUID().toString(); // Token unique
        user.setResetToken(token);
        userRepository.save(user);

        // lien de réinitialisation
        String resetLink = "http://admin.pcdirac.com/reset-password?token=" + token;

        // envoyer l'email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Réinitialisation de mot de passe");
        message.setText("Bonjour " + user.getPrenom() +
                ",\n\nCliquez sur le lien suivant pour réinitialiser votre mot de passe :\n" +
                resetLink);

        mailSender.send(message);

        return ResponseEntity.ok("Email envoyé avec succès ✅");
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        Optional<User> userOpt = userRepository.findByResetToken(token);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(400).body("Token invalide");
        }

        User user = userOpt.get();
        user.setMotdepasse(passwordEncoder.encode(newPassword));
        user.setResetToken(null); // clear le token
        userRepository.save(user);

        return ResponseEntity.ok("Mot de passe réinitialisé avec succès ✅");
    }

}

