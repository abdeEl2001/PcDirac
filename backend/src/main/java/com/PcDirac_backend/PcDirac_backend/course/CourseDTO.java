package com.PcDirac_backend.PcDirac_backend.course;


public class CourseDTO {
    private Long id;
    private String titre;
    private String niveau;
    private String categorie;
    private String matiere;
    private String ordre;
    private String miniature;
    private String unite;
    private String pdf_fichier;
    private String professeur; // from User

    public CourseDTO(Long id, String titre, String niveau, String categorie, String matiere,
                     String ordre, String miniature, String unite, String pdf_fichier, String professeur) {
        this.id = id;
        this.titre = titre;
        this.niveau = niveau;
        this.categorie = categorie;
        this.matiere = matiere;
        this.ordre = ordre;
        this.miniature = miniature;
        this.unite = unite;         // ✅ correct place
        this.pdf_fichier = pdf_fichier;
        this.professeur = professeur;
    }


    // Getters
    public Long getId() { return id; }
    public String getTitre() { return titre; }
    public String getNiveau() { return niveau; }
    public String getCategorie() { return categorie; }
    public String getMatiere() { return matiere; }
    public String getOrdre() { return ordre; }
    public String getMiniature() { return miniature; }
    public String getPdf_fichier() { return pdf_fichier; }
    public String getProfesseur() { return professeur; }

    public String getUnite() {
        return unite;
    }
}
