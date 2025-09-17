package com.PcDirac_backend.PcDirac_backend.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.File;
import java.io.IOException;

@RestController
@CrossOrigin(
        origins = {"https://pcdirac.com", "https://admin.pcdirac.com", "https://api.pcdirac.com"},
        allowCredentials = "true"
)

@RequestMapping("/api/users/update")
public class UserProfileUpdateController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileUpdateController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable Long id,
            @RequestParam String prenom,
            @RequestParam String nom,
            @RequestParam String email,
            @RequestParam String motdepasse,
            @RequestParam String numerotelephone,
            @RequestParam(required = false) MultipartFile photoProfil
    ) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé");
        }

        user.setPrenom(prenom);
        user.setNom(nom);
        user.setEmail(email);

        if (motdepasse != null && !motdepasse.isEmpty()) {
            user.setMotdepasse(passwordEncoder.encode(motdepasse));
        }

        user.setNumerotelephone(numerotelephone);

        if (photoProfil != null && !photoProfil.isEmpty()) {
            try {
                String path = "/var/www/PcDirac/backend/uploads/photos/" + photoProfil.getOriginalFilename();
                photoProfil.transferTo(new File(path));
                user.setPhotoprofile("/uploads/photos/" + photoProfil.getOriginalFilename());
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erreur lors de l'enregistrement de la photo: " + e.getMessage());
            }
        }

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}
