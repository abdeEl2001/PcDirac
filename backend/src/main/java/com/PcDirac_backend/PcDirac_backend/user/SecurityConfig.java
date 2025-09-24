package com.PcDirac_backend.PcDirac_backend.user;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ✅ CORS configuration for all endpoints
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of(
                "https://pcdirac.com",
                "https://admin.pcdirac.com",
                "https://api.pcdirac.com",
                "https://www.pcdirac.com",
                "https://www.admin.pcdirac.com",
                "https://www.api.pcdirac.com"
        ));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) //
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ force Spring Security to use our CORS
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
                                "/api/courses/etudiant/lycee",
                                "/api/courses/etudiant/agregation",
                                "/api/courses/etudiant/license",
                                "/api/videos",
                                "/api/videos/{id}",
                                "/api/videos/all"// <-- add this line
                        ).permitAll()
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
