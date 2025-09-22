package com.PcDirac_backend.PcDirac_backend.video;

import com.PcDirac_backend.PcDirac_backend.user.User;
import com.PcDirac_backend.PcDirac_backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private UserRepository userRepository;

    // Ajouter une vidéo pour un utilisateur spécifique
    public Video addVideo(Long userId, Video video) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            video.setUser(userOpt.get());
            return videoRepository.save(video);
        } else {
            throw new RuntimeException("Utilisateur non trouvé avec l'id : " + userId);
        }
    }

    // Récupérer toutes les vidéos
    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    // Récupérer toutes les vidéos d'un utilisateur
    public List<Video> getVideosByUser(Long userId) {
        return videoRepository.findByUserId(userId);
    }

    // Récupérer une vidéo par ID
    public Video getVideoById(Long id) {
        return videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vidéo non trouvée avec l'id : " + id));
    }

    // Supprimer une vidéo par ID
    public void deleteVideo(Long id) {
        if (videoRepository.existsById(id)) {
            videoRepository.deleteById(id);
        } else {
            throw new RuntimeException("Vidéo non trouvée avec l'id : " + id);
        }
    }

    // Mettre à jour une vidéo
    public Video updateVideo(Long id, Video updatedVideo) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vidéo non trouvée avec l'id : " + id));

        video.setEtape(updatedVideo.getEtape());
        video.setNiveau(updatedVideo.getNiveau());
        video.setMatiere(updatedVideo.getMatiere());
        video.setCategorie(updatedVideo.getCategorie());
        video.setUnite(updatedVideo.getUnite());
        video.setTitre(updatedVideo.getTitre());
        video.setOrdre(updatedVideo.getOrdre());
        video.setMiniature(updatedVideo.getMiniature());
        video.setLien(updatedVideo.getLien());

        return videoRepository.save(video);
    }
    private final String basePath = "C:/Users/abdel/uploads/";

    public VideoService(VideoRepository videoRepository) {
        this.videoRepository = videoRepository;
    }

    // Save video + files
    public Video saveVideo(Video video, MultipartFile miniature, String lien) throws IOException {

        // ---------- Miniature ----------
        if (miniature != null && !miniature.isEmpty()) {
            String miniDir = basePath + "miniature/";
            Files.createDirectories(Paths.get(miniDir));
            String miniPath = miniDir + miniature.getOriginalFilename();
            miniature.transferTo(new File(miniPath));
            video.setMiniature("/uploads/miniature/" + miniature.getOriginalFilename());
        }

        // Save video entity in DB
        return videoRepository.save(video);
}
}

