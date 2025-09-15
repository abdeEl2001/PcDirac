package com.PcDirac_backend.PcDirac_backend.user;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String motdepasse;

    @Column(nullable = false)
    private String numerotelephone;

    @Column(nullable = true)
    private String photoprofile;

    private boolean active;
    private String activationToken;
    private String resetToken;


    // Optional: add more fields like nom, prenom, etc.

    public User() {
    }

    public User(Long id,
                String nom,
                String email,
                String prenom,
                String motdepasse,
                String numerotelephone,
                String photoprofile,
                boolean active,
                String activationToken,
                String resetToken) {
        this.id = id;
        this.nom = nom;
        this.email = email;
        this.prenom = prenom;
        this.motdepasse = motdepasse;
        this.numerotelephone = numerotelephone;
        this.photoprofile = photoprofile;
        this.active = active;
        this.activationToken = activationToken;
        this.resetToken=resetToken;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMotdepasse() { return motdepasse; }
    public void setMotdepasse(String motdepasse) { this.motdepasse = motdepasse; }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getNumerotelephone() {
        return numerotelephone;
    }

    public void setNumerotelephone(String numerotelephone) {
        this.numerotelephone = numerotelephone;
    }

    public String getPhotoprofile() {
        return photoprofile;
    }

    public void setPhotoprofile(String photoprofile) {
        this.photoprofile = photoprofile;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getActivationToken() {
        return activationToken;
    }

    public void setActivationToken(String activationToken) {
        this.activationToken = activationToken;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }
}
