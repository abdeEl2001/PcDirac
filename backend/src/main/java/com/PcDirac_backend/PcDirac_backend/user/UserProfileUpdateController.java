package com.PcDirac_backend.PcDirac_backend.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users/update")
public class UserProfileUpdateController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // inject encoder

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
            @RequestParam(required = false) String photoProfil) {

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé");
        }

        user.setPrenom(prenom);
        user.setNom(nom);
        user.setEmail(email);

        // ✅ encrypt password before saving
        if (motdepasse != null && !motdepasse.isEmpty()) {
            user.setMotdepasse(passwordEncoder.encode(motdepasse));
        }

        user.setNumerotelephone(numerotelephone);

        // Save photo if provided
        if (photoProfil != null && !photoProfil.isEmpty()) {
            String filename = photoProfil;
            // TODO: add logic to actually save the file into "uploads/"
            user.setPhotoprofile(filename);
        }

        userRepository.save(user);

        return ResponseEntity.ok(user);
    }
}
