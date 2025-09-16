package com.PcDirac_backend.PcDirac_backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(401).body("Email ou mot de passe incorrect ❌");
        }

        // Vérifier si le compte est activé
        if (!user.isActive()) {
            return ResponseEntity.status(403).body("Ce compte n'est pas encore activé ❌");
        }

        // Vérifier le mot de passe avec le hash
        if (!passwordEncoder.matches(loginRequest.getMotdepasse(), user.getMotdepasse())) {
            return ResponseEntity.status(401).body("Email ou mot de passe incorrect ❌");
        }

        // Si tout est bon
        return ResponseEntity.ok(Map.of(
                "userId", user.getId(),
                "email", user.getEmail()
        ));
    }
}
