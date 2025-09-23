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
            @RequestParam(required = false) String prenom,
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String motdepasse,
            @RequestParam(required = false) String numerotelephone,
            @RequestPart(required = false) MultipartFile photoProfil
    ) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé");
        }

        // Update fields only if they are provided
        if (prenom != null && !prenom.isEmpty()) user.setPrenom(prenom);
        if (nom != null && !nom.isEmpty()) user.setNom(nom);
        if (email != null && !email.isEmpty()) user.setEmail(email);
        if (numerotelephone != null && !numerotelephone.isEmpty()) user.setNumerotelephone(numerotelephone);

        if (motdepasse != null && !motdepasse.isEmpty()) {
            user.setMotdepasse(passwordEncoder.encode(motdepasse));
        }

        // Handle photo upload
        if (photoProfil != null && !photoProfil.isEmpty()) {
            String uploadsDir = "/var/www/PcDirac/backend/uploads/profiles/"; // your uploads directory
            File uploadDir = new File(uploadsDir);
            if (!uploadDir.exists()) uploadDir.mkdirs();

            // ✅ Delete old profile photo if exists
            if (user.getPhotoprofile() != null) {
                File oldFile = new File(uploadsDir, user.getPhotoprofile());
                if (oldFile.exists()) {
                    oldFile.delete();
                }
            }

            // Save new file
            String filename = System.currentTimeMillis() + "_" + photoProfil.getOriginalFilename();
            File file = new File(uploadDir, filename);
            try {
                photoProfil.transferTo(file); // save file
                user.setPhotoprofile(filename);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erreur lors de l'enregistrement de l'image");
            }
        }

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}
