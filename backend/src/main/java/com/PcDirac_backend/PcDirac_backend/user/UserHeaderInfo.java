package com.PcDirac_backend.PcDirac_backend.user;

public class UserHeaderInfo {
    private String prenom;
    private String nom;
    private String photoprofile;

    public UserHeaderInfo(String prenom, String nom, String photoprofile) {
        this.prenom = prenom;
        this.nom = nom;
        this.photoprofile = photoprofile;
    }

    // getters
    public String getPrenom() { return prenom; }
    public String getNom() { return nom; }
    public String getPhotoprofile() { return photoprofile; }
}
