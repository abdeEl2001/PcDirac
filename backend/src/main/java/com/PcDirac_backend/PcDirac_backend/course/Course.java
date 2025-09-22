package com.PcDirac_backend.PcDirac_backend.course;

import com.PcDirac_backend.PcDirac_backend.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String etape;
    private String titre;
    @Column(nullable = true)
    private String niveau;
    private String categorie;
    @Column(nullable = true)
    private String matiere;
    private String ordre;
    private String miniature;
    private String pdf_fichier;
    @Column(nullable = true)
    private String unite;

    private LocalDateTime cree_le = LocalDateTime.now();
    private LocalDateTime mise_a_jour_le = LocalDateTime.now();

    public Course() {
    }

    public Course(Long id,
                  User user,
                  String etape,
                  String titre,
                  String niveau,
                  String categorie,
                  String matiere,
                  String ordre,
                  String miniature,
                  String pdf_fichier,
                  String unite,
                  LocalDateTime cree_le,
                  LocalDateTime mise_a_jour_le) {
        this.id = id;
        this.user = user;
        this.etape=etape;
        this.titre = titre;
        this.niveau = niveau;
        this.categorie = categorie;
        this.matiere = matiere;
        this.ordre = ordre;
        this.miniature = miniature;
        this.unite=unite;
        this.pdf_fichier = pdf_fichier;
        this.cree_le = cree_le;
        this.mise_a_jour_le = mise_a_jour_le;
    }

    public Course(User user,
                  String etape,
                  String titre,
                  String categorie,
                  String niveau,
                  String matiere,
                  String ordre,
                  String miniature,
                  String unite,
                  String pdf_fichier,
                  LocalDateTime cree_le,
                  LocalDateTime mise_a_jour_le) {
        this.user = user;
        this.etape=etape;
        this.titre = titre;
        this.categorie = categorie;
        this.niveau = niveau;
        this.matiere = matiere;
        this.ordre = ordre;
        this.miniature = miniature;
        this.unite=unite;
        this.pdf_fichier = pdf_fichier;
        this.cree_le = cree_le;
        this.mise_a_jour_le = mise_a_jour_le;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getEtape() {
        return etape;
    }

    public void setEtape(String etape) {
        this.etape = etape;
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

    public String getOrdre() {
        return ordre;
    }

    public void setOrdre(String ordre) {
        this.ordre = ordre;
    }

    public String getMiniature() {
        return miniature;
    }

    public void setMiniature(String miniature) {
        this.miniature = miniature;
    }

    public String getPdf_fichier() {
        return pdf_fichier;
    }

    public void setPdf_fichier(String pdf_fichier) {
        this.pdf_fichier = pdf_fichier;
    }

    public LocalDateTime getCree_le() {
        return cree_le;
    }

    public void setCree_le(LocalDateTime cree_le) {
        this.cree_le = cree_le;
    }

    public LocalDateTime getMise_a_jour_le() {
        return mise_a_jour_le;
    }

    public void setMise_a_jour_le(LocalDateTime mise_a_jour_le) {
        this.mise_a_jour_le = mise_a_jour_le;
    }

    public String getUnite() {
        return unite;
    }

    public void setUnite(String unite) {
        this.unite = unite;
    }
}

