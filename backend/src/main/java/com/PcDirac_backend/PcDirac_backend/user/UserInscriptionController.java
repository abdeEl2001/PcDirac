package com.PcDirac_backend.PcDirac_backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserInscriptionController {

    @Autowired
    private UserInscriptionRepository userInscriptionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // make sure this bean exists

    @Autowired
    private EmailService emailService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerUser(
            @RequestParam("prenom") String prenom,
            @RequestParam("nom") String nom,
            @RequestParam("email") String email,
            @RequestParam("motdepasse") String motdepasse,
            @RequestParam("numerotelephone") String numerotelephone,
            @RequestParam(value = "photoprofile", required = false) MultipartFile photoprofile
    ) {
        try {
            // 1️⃣ Check if email already exists
            if (userInscriptionRepository.existsByEmail(email)) {
                return ResponseEntity
                        .badRequest()
                        .body("Cet email est déjà utilisé !");
            }

            // 2️⃣ Create user
            User user = new User();
            user.setPrenom(prenom);
            user.setNom(nom);
            user.setEmail(email);
            user.setMotdepasse(passwordEncoder.encode(motdepasse)); // encode the raw password
            user.setNumerotelephone(numerotelephone);
            user.setActive(false); // initially inactive

            // 3️⃣ Generate activation token
            String token = UUID.randomUUID().toString();
            user.setActivationToken(token);

            // 4️⃣ Save user (without photo yet)
            userInscriptionRepository.save(user);

            // 5️⃣ Handle photo upload if exists
            if (photoprofile != null && !photoprofile.isEmpty()) {
                String uploadDir = "C:/Users/abdel/uploads/profiles/";
                String fileName = user.getId() + "_" + photoprofile.getOriginalFilename();
                Path filePath = Paths.get(uploadDir + fileName);
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, photoprofile.getBytes());

                user.setPhotoprofile(fileName);
                userInscriptionRepository.save(user); // update user with photo
            }

            // 6️⃣ Send activation email
            emailService.sendActivationEmail(user.getEmail(), token);

            return ResponseEntity.ok("Inscription réussie ! Veuillez vérifier votre email pour activer le compte.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur lors de l'inscription: " + e.getMessage());
        }
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam("email") String email) {
        boolean exists = userInscriptionRepository.existsByEmail(email);
        return ResponseEntity.ok(Map.of("exists", exists)); // return JSON object
    }

    @GetMapping("/activate")
    public ResponseEntity<String> activateAccount(@RequestParam("token") String token) {
        User user = userInscriptionRepository.findByActivationToken(token)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("Lien d'activation invalide !");
        }

        user.setActive(true); // activate account
        user.setActivationToken(null); // remove token after use
        userInscriptionRepository.save(user);

        return ResponseEntity.ok("Compte activé avec succès 🎉 Vous pouvez maintenant vous connecter.");
    }
}
