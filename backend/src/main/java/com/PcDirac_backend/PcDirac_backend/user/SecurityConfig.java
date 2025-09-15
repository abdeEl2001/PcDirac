package com.PcDirac_backend.PcDirac_backend.user;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // disable CSRF for testing with Postman
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/users",
                                "/api/users/check-email",
                                "/api/users/activate",
                                "/api/auth/login",
                                "/api/courses",
                                "/api/courses/{id}",
                                "/api/users/header/{id}",   // notice I fixed "api" → "/api"
                                "/uploads/**" ,
                                "/api/users/update/{id}",
                                "api/users/profileInformation/{userId}",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password",
                                "/api/courses/etudiant/cours",
                                "/api/courses/etudiant/exercice",
                                "/api/courses/etudiant/activitie"// <-- add this line
                        ).permitAll()
                        .anyRequest().authenticated()
                );


        return http.build();
    }

}
