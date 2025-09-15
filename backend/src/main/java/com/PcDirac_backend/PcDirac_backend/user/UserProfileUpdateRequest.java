package com.PcDirac_backend.PcDirac_backend.user;

import org.springframework.web.multipart.MultipartFile;

public class UserProfileUpdateRequest {
    private String prenom;
    private String nom;
    private String email;
    private String numerotelephone;
    private String photoProfil; // for file upload

    public UserProfileUpdateRequest() {
    }

    public UserProfileUpdateRequest(String prenom,
                                    String nom,
                                    String email,
                                    String numerotelephone,
                                    String photoProfil) {
        this.prenom = prenom;
        this.nom = nom;
        this.email = email;
        this.numerotelephone = numerotelephone;
        this.photoProfil = photoProfil;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNumerotelephone() {
        return numerotelephone;
    }

    public void setNumerotelephone(String numerotelephone) {
        this.numerotelephone = numerotelephone;
    }

    public String getPhotoProfil() {
        return photoProfil;
    }

    public void setPhotoProfil(String photoProfil) {
        this.photoProfil = photoProfil;
    }
}
