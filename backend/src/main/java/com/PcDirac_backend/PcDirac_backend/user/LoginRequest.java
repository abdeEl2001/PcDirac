package com.PcDirac_backend.PcDirac_backend.user;
public class LoginRequest {
    private String email;
    private String motdepasse;

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMotdepasse() { return motdepasse; }
    public void setMotdepasse(String motdepasse) { this.motdepasse = motdepasse; }
}
