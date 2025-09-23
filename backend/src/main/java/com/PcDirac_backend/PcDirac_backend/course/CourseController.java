package com.PcDirac_backend.PcDirac_backend.course;
import com.PcDirac_backend.PcDirac_backend.user.User;
import com.PcDirac_backend.PcDirac_backend.user.UserRepository;
import com.PcDirac_backend.PcDirac_backend.utils.FileStorageService;
import com.PcDirac_backend.PcDirac_backend.utils.FileStorageUtil;
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
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final FileStorageService fileStorageService;
    private final FileStorageUtil fileStorageUtil;

    public CourseController(CourseService courseService,
                            UserRepository userRepository,
                            CourseRepository courseRepository,
                            FileStorageService fileStorageService,
                            FileStorageUtil fileStorageUtil) {
        this.courseService = courseService;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.fileStorageService = fileStorageService;
        this.fileStorageUtil = fileStorageUtil;
    }

    // ================= ADD COURSE =================
    @PostMapping
    public ResponseEntity<?> addCourse(
            @RequestParam("etape") String etape,
            @RequestParam("titre") String titre,
            @RequestParam(value = "niveau", required = false) String niveau,
            @RequestParam("categorie") String categorie,
            @RequestParam(value = "matiere", required = false) String matiere,
            @RequestParam("ordre") String ordre,
            @RequestParam(value = "unite", required = false) String unite,
            @RequestParam("miniature") MultipartFile miniature,
            @RequestParam("pdf_fichier") MultipartFile pdfFile,
            @RequestParam("userId") Long userId
    ) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Ensure user folder structure is created
            fileStorageUtil.createUserFolders(user.getId(), user.getNom(), user.getPrenom());

            Course course = new Course();
            course.setEtape(etape);
            course.setTitre(titre);
            course.setNiveau(niveau);
            course.setCategorie(categorie);
            course.setMatiere(matiere);
            course.setOrdre(ordre);
            course.setUnite(unite);
            course.setUser(user);

            // Save miniature and PDF in their proper folders
            if (miniature != null && !miniature.isEmpty()) {
                String miniaturePath = fileStorageService.saveUserFile(user, miniature, "miniature", categorie);
                course.setMiniature(miniaturePath);
            }

            if (pdfFile != null && !pdfFile.isEmpty()) {
                String pdfPath = fileStorageService.saveUserFile(user, pdfFile, "file", categorie);
                course.setPdf_fichier(pdfPath);
            }

            courseRepository.save(course);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Cours ajouté avec succès !");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erreur lors de l'ajout du cours : " + e.getMessage());
        }
    }

    // ================= UPDATE COURSE =================
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Long id,
            @RequestParam("etape") String etape,
            @RequestParam("titre") String titre,
            @RequestParam(value = "niveau", required = false) String niveau,
            @RequestParam("categorie") String categorie,
            @RequestParam(value = "matiere", required = false) String matiere,
            @RequestParam("ordre") String ordre,
            @RequestParam(value = "unite", required = false) String unite,
            @RequestParam(value = "miniature", required = false) MultipartFile miniature,
            @RequestParam(value = "pdf_fichier", required = false) MultipartFile pdfFile
    ) throws IOException {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        User user = course.getUser();

        // Update fields
        course.setEtape(etape);
        course.setTitre(titre);
        course.setNiveau(niveau);
        course.setCategorie(categorie);
        course.setMatiere(matiere);
        course.setOrdre(ordre);
        course.setUnite(unite);

        // Update miniature
        if (miniature != null && !miniature.isEmpty()) {
            if (course.getMiniature() != null) {
                File oldMiniature = new File(fileStorageService.getFileAbsolutePath(course.getMiniature()));
                if (oldMiniature.exists()) oldMiniature.delete();
            }
            String miniaturePath = fileStorageService.saveUserFile(user, miniature, "miniature", categorie);
            course.setMiniature(miniaturePath);
        }

        // Update PDF
        if (pdfFile != null && !pdfFile.isEmpty()) {
            if (course.getPdf_fichier() != null) {
                File oldPdf = new File(fileStorageService.getFileAbsolutePath(course.getPdf_fichier()));
                if (oldPdf.exists()) oldPdf.delete();
            }
            String pdfPath = fileStorageService.saveUserFile(user, pdfFile, "file", categorie);
            course.setPdf_fichier(pdfPath);
        }

        return ResponseEntity.ok(courseRepository.save(course));
    }

    // ================= DELETE COURSE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            Course course = courseRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Course not found"));

            User user = course.getUser();

            // Delete miniature
            if (course.getMiniature() != null) {
                File miniatureFile = new File(fileStorageService.getFileAbsolutePath(course.getMiniature()));
                if (miniatureFile.exists()) miniatureFile.delete();
            }

            // Delete PDF
            if (course.getPdf_fichier() != null) {
                File pdfFile = new File(fileStorageService.getFileAbsolutePath(course.getPdf_fichier()));
                if (pdfFile.exists()) pdfFile.delete();
            }

            courseRepository.delete(course);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Cours supprimé avec succès !");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erreur lors de la suppression du cours : " + e.getMessage());
        }
    }

    // ================= GET COURSES =================
    @GetMapping
    public ResponseEntity<?> getCoursesByUser(@RequestParam("userId") Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Course> courses = courseService.getCoursesByUser(user);
            return ResponseEntity.ok(courses);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erreur lors de la récupération des cours : " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
