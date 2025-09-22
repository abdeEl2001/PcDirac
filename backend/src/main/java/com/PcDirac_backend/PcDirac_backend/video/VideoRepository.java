package com.PcDirac_backend.PcDirac_backend.video;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {

    // Récupérer toutes les vidéos d'un utilisateur spécifique
    List<Video> findByUserId(Long userId);

    // Récupérer toutes les vidéos par étape
    List<Video> findByEtape(String etape);

    // Récupérer toutes les vidéos par catégorie
    List<Video> findByCategorie(String categorie);

    // Récupérer toutes les vidéos par matière
    List<Video> findByMatiere(String matiere);

    // Récupérer toutes les vidéos par niveau
    List<Video> findByNiveau(String niveau);

    List<Video> findAll();
}