package com.PcDirac_backend.PcDirac_backend.user;// service/UserService.java
import com.PcDirac_backend.PcDirac_backend.user.User;
import com.PcDirac_backend.PcDirac_backend.user.UserInscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserInscriptionService {
    @Autowired
    private UserInscriptionRepository userRepository;

    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }
        return userRepository.save(user);
    }
}
