package com.PcDirac_backend.PcDirac_backend.video;

import com.PcDirac_backend.PcDirac_backend.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "videos")
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String etape;         // Lycée / Collège / Licence / Agrégation
    private String titre;         // Titre de la vidéo

    @Column(nullable = true)
    private String niveau;        // Exemple : "1ère Année Bac"

    private String categorie;// Cours, Exercices, Concours, etc.
    @Column(nullable = true)
    private String matiere;       // Physique ou Chimie

    @Column(nullable = true)
    private String unite;         // Unité du cours

    private Integer ordre;        // Ordre d'affichage
    private String miniature;     // Lien vers l’image miniature
    private String lien;          // Lien de la vidéo ou fichier

    @Column(name = "created_at", updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;

    public Video() {
    }

    public Video(User user,
                 Long id,
                 String etape,
                 String titre,
                 String categorie,
                 String niveau,
                 String unite,
                 String matiere,
                 Integer ordre,
                 String miniature,
                 String lien,
                 LocalDateTime createdAt,
                 LocalDateTime updatedAt) {
        this.user = user;
        this.id = id;
        this.etape = etape;
        this.titre = titre;
        this.categorie = categorie;
        this.niveau = niveau;
        this.unite = unite;
        this.matiere = matiere;
        this.ordre = ordre;
        this.miniature = miniature;
        this.lien = lien;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Video(User user,
                 String etape,
                 String titre,
                 String categorie,
                 String niveau,
                 String unite,
                 String matiere,
                 Integer ordre,
                 String miniature,
                 String lien,
                 LocalDateTime createdAt,
                 LocalDateTime updatedAt) {
        this.user = user;
        this.etape = etape;
        this.titre = titre;
        this.categorie = categorie;
        this.niveau = niveau;
        this.unite = unite;
        this.matiere = matiere;
        this.ordre = ordre;
        this.miniature = miniature;
        this.lien = lien;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEtape() {
        return etape;
    }

    public void setEtape(String etape) {
        this.etape = etape;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getNiveau() {
        return niveau;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    public String getMatiere() {
        return matiere;
    }

    public void setMatiere(String matiere) {
        this.matiere = matiere;
    }

    public String getUnite() {
        return unite;
    }

    public void setUnite(String unite) {
        this.unite = unite;
    }

    public Integer getOrdre() {
        return ordre;
    }

    public void setOrdre(Integer ordre) {
        this.ordre = ordre;
    }

    public String getMiniature() {
        return miniature;
    }

    public void setMiniature(String miniature) {
        this.miniature = miniature;
    }

    public String getLien() {
        return lien;
    }

    public void setLien(String lien) {
        this.lien = lien;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
