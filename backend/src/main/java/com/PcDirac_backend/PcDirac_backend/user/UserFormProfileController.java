package com.PcDirac_backend.PcDirac_backend.user;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users/profileInformation")
public class UserFormProfileController {

    @Autowired
    private UserRepository userRepository;

    // Get user by email or ID
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileUpdateRequest> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    UserProfileUpdateRequest dto = new UserProfileUpdateRequest(
                            user.getPrenom(),
                            user.getNom(),
                            user.getEmail(),
                            user.getNumerotelephone(),
                            user.getPhotoprofile()
                    );
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }




}
