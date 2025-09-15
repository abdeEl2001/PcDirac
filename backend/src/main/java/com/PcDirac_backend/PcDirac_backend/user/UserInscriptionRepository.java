package com.PcDirac_backend.PcDirac_backend.user;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserInscriptionRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByActivationToken(String token);
}
