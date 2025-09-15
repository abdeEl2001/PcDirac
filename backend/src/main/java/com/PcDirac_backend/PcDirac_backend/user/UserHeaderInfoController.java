package com.PcDirac_backend.PcDirac_backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // allow React
public class UserHeaderInfoController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/header/{id}")
    public ResponseEntity<UserHeaderInfo> getUserHeader(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    String photoUrl = user.getPhotoprofile();
                    return ResponseEntity.ok(new UserHeaderInfo(user.getPrenom(), user.getNom(), photoUrl));
                })
                .orElse(ResponseEntity.notFound().build());
    }


}

