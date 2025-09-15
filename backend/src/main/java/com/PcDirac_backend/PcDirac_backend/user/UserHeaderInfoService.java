package com.PcDirac_backend.PcDirac_backend.user;

import org.springframework.stereotype.Service;

@Service
public class UserHeaderInfoService {
    private final UserRepository userRepository;

    public UserHeaderInfoService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserHeaderInfo getHeaderInfoByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserHeaderInfo(user.getPrenom(), user.getNom(), user.getPhotoprofile());
    }
}
