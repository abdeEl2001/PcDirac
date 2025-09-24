package com.PcDirac_backend.PcDirac_backend.video;

import com.PcDirac_backend.PcDirac_backend.course.Course;
import com.PcDirac_backend.PcDirac_backend.utils.FileStorageService;
import com.PcDirac_backend.PcDirac_backend.user.User;
import com.PcDirac_backend.PcDirac_backend.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/videos")
public class VideoController {

    private final VideoService videoService;
    private final UserRepository userRepository;
    private final VideoRepository videoRepository;
    private final FileStorageService fileStorageService;

    public VideoController(VideoService videoService,
                           UserRepository userRepository,
                           VideoRepository videoRepository,
                           FileStorageService fileStorageService) {
        this.videoService = videoService;
        this.userRepository = userRepository;
        this.videoRepository = videoRepository;
        this.fileStorageService = fileStorageService;
    }

    // ================= ADD VIDEO =================
    @PostMapping
    public ResponseEntity<?> addVideo(
            @RequestParam("etape") String etape,
            @RequestParam("titre") String titre,
            @RequestParam(value = "niveau", required = false) String niveau,
            @RequestParam("categorie") String categorie,
            @RequestParam(value = "matiere", required = false) String matiere,
            @RequestParam("ordre") int ordre,
            @RequestParam(value = "unite", required = false) String unite,
            @RequestParam("miniature") MultipartFile miniature,
            @RequestParam("lien") String lien,
            @RequestParam("userId") Long userId
    ) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Ensure user folder structure exists
            fileStorageService.getFileStorageUtil().createUserFolders(user.getId(), user.getNom(), user.getPrenom());

            Video video = new Video();
            video.setEtape(etape);
            video.setTitre(titre);
            video.setNiveau(niveau);
            video.setCategorie(categorie);
            video.setMatiere(matiere);
            video.setOrdre(ordre);
            video.setUnite(unite);
            video.setUser(user);
            video.setLien(lien);

            // Save miniature
            if (miniature != null && !miniature.isEmpty()) {
                String path = fileStorageService.saveUserFile(user, miniature, "videos_miniature", categorie);
                video.setMiniature(path);
            }

            videoRepository.save(video);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Vidéo ajoutée avec succès !");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body("Erreur lors de l'ajout de la vidéo : " + e.getMessage());
        }
    }

    // ================= UPDATE VIDEO =================
    @PutMapping("/{id}")
    public ResponseEntity<Video> updateVideo(
            @PathVariable Long id,
            @RequestParam("etape") String etape,
            @RequestParam("titre") String titre,
            @RequestParam(value = "niveau", required = false) String niveau,
            @RequestParam("categorie") String categorie,
            @RequestParam(value = "matiere", required = false) String matiere,
            @RequestParam("ordre") int ordre,
            @RequestParam(value = "unite", required = false) String unite,
            @RequestParam(value = "miniature", required = false) MultipartFile miniature,
            @RequestParam(value = "lien", required = false) String lien
    ) throws IOException {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        video.setEtape(etape);
        video.setTitre(titre);
        video.setNiveau(niveau);
        video.setCategorie(categorie);
        video.setMatiere(matiere);
        video.setOrdre(ordre);
        video.setUnite(unite);
        video.setLien(lien);

        // Update miniature
        if (miniature != null && !miniature.isEmpty()) {
            if (video.getMiniature() != null) {
                File oldMini = new File(fileStorageService.getFileAbsolutePath(video.getMiniature()));
                if (oldMini.exists()) oldMini.delete();
            }
            String path = fileStorageService.saveUserFile(video.getUser(), miniature, "videos_miniature", categorie);
            video.setMiniature(path);
        }

        return ResponseEntity.ok(videoRepository.save(video));
    }


    // ================= DELETE VIDEO =================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVideo(@PathVariable Long id) {
        try {
            Video video = videoRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Video not found"));

            if (video.getMiniature() != null) {
                File mini = new File(video.getMiniature());
                if (mini.exists()) mini.delete();
            }

            videoRepository.delete(video);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Vidéo supprimée avec succès !");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erreur lors de la suppression de la vidéo : " + e.getMessage());
        }
    }
    @GetMapping
    public ResponseEntity<?> getVideosByUser(@RequestParam("userId") Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Video> videos = videoService.getVideosByUser(user.getId());
            return ResponseEntity.ok(videos);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erreur lors de la récupération des videos : " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Video> getVideoById(@PathVariable Long id) {
        return videoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    // ================= FILTER VIDEOS =================
    @GetMapping("/all")
    public ResponseEntity<List<Video>> getAllVideos(
            @RequestParam(value = "etape", required = false) String etape,
            @RequestParam(value = "niveau", required = false) String niveau,
            @RequestParam(value = "categorie", required = false) String categorie,
            @RequestParam(value = "matiere", required = false) String matiere,
            @RequestParam(value = "unite", required = false) String unite,
            @RequestParam(value = "titre", required = false) String titre
    ) {
        try {
            List<Video> videos = videoRepository.findAll();

            if (etape != null && !etape.isEmpty()) {
                videos = videos.stream()
                        .filter(v -> v.getEtape() != null && etape.equalsIgnoreCase(v.getEtape()))
                        .collect(Collectors.toList());
            }
            if (niveau != null && !niveau.isEmpty()) {
                videos = videos.stream()
                        .filter(v -> v.getNiveau() != null && niveau.equalsIgnoreCase(v.getNiveau()))
                        .collect(Collectors.toList());
            }
            if (categorie != null && !categorie.isEmpty()) {
                videos = videos.stream()
                        .filter(v -> v.getCategorie() != null && categorie.equalsIgnoreCase(v.getCategorie()))
                        .collect(Collectors.toList());
            }
            if (matiere != null && !matiere.isEmpty()) {
                videos = videos.stream()
                        .filter(v -> v.getMatiere() != null && matiere.equalsIgnoreCase(v.getMatiere()))
                        .collect(Collectors.toList());
            }
            if (unite != null && !unite.isEmpty()) {
                videos = videos.stream()
                        .filter(v -> v.getUnite() != null && unite.equalsIgnoreCase(v.getUnite()))
                        .collect(Collectors.toList());
            }
            if (titre != null && !titre.isEmpty()) {
                videos = videos.stream()
                        .filter(v -> v.getTitre() != null && titre.equalsIgnoreCase(v.getTitre()))
                        .collect(Collectors.toList());
            }

            return ResponseEntity.ok(videos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}
