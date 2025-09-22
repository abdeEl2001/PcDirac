package com.PcDirac_backend.PcDirac_backend.course;

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
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    // Base upload directory
    private final String UPLOAD_DIR = "/var/www/PcDirac/backend/uploads/";

    public CourseController(CourseService courseService,
                            UserRepository userRepository,
                            CourseRepository courseRepository) {
        this.courseService = courseService;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
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

            Course course = new Course();
            course.setEtape(etape);
            course.setTitre(titre);
            course.setNiveau(niveau);
            course.setCategorie(categorie);
            course.setMatiere(matiere);
            course.setOrdre(ordre);
            course.setUnite(unite);
            course.setUser(user);

            // Save files
            if (miniature != null && !miniature.isEmpty()) {
                File miniatureDir = new File(UPLOAD_DIR + "miniature/");
                if (!miniatureDir.exists()) miniatureDir.mkdirs();
                String miniaturePath = UPLOAD_DIR + "miniature/" + miniature.getOriginalFilename();
                miniature.transferTo(new File(miniaturePath));
                course.setMiniature("/uploads/miniature/" + miniature.getOriginalFilename());
            }

            if (pdfFile != null && !pdfFile.isEmpty()) {
                File pdfDir = new File(UPLOAD_DIR + "courses/");
                if (!pdfDir.exists()) pdfDir.mkdirs();
                String pdfPath = UPLOAD_DIR + "courses/" + pdfFile.getOriginalFilename();
                pdfFile.transferTo(new File(pdfPath));
                course.setPdf_fichier("/uploads/courses/" + pdfFile.getOriginalFilename());
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

        // Update text fields
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
                File oldMiniature = new File(UPLOAD_DIR + "miniature/" + new File(course.getMiniature()).getName());
                if (oldMiniature.exists()) oldMiniature.delete();
            }
            File miniatureDir = new File(UPLOAD_DIR + "miniature/");
            if (!miniatureDir.exists()) miniatureDir.mkdirs();
            String miniaturePath = UPLOAD_DIR + "miniature/" + miniature.getOriginalFilename();
            miniature.transferTo(new File(miniaturePath));
            course.setMiniature("/uploads/miniature/" + miniature.getOriginalFilename());
        }

        // Update PDF
        if (pdfFile != null && !pdfFile.isEmpty()) {
            if (course.getPdf_fichier() != null) {
                File oldPdf = new File(UPLOAD_DIR + "courses/" + new File(course.getPdf_fichier()).getName());
                if (oldPdf.exists()) oldPdf.delete();
            }
            File pdfDir = new File(UPLOAD_DIR + "courses/");
            if (!pdfDir.exists()) pdfDir.mkdirs();
            String pdfPath = UPLOAD_DIR + "courses/" + pdfFile.getOriginalFilename();
            pdfFile.transferTo(new File(pdfPath));
            course.setPdf_fichier("/uploads/courses/" + pdfFile.getOriginalFilename());
        }

        return ResponseEntity.ok(courseRepository.save(course));
    }

    // ================= DELETE COURSE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            Course course = courseRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Course not found"));

            // Delete miniature
            if (course.getMiniature() != null) {
                File miniatureFile = new File(UPLOAD_DIR + "miniature/" + new File(course.getMiniature()).getName());
                if (miniatureFile.exists()) miniatureFile.delete();
            }

            // Delete PDF
            if (course.getPdf_fichier() != null) {
                File pdfFile = new File(UPLOAD_DIR + "courses/" + new File(course.getPdf_fichier()).getName());
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

    // ================= COURSES BY ETAPE =================
    private CourseDTO mapToDTO(Course course) {
        return new CourseDTO(
                course.getId(),
                course.getEtape(),
                course.getTitre(),
                course.getNiveau(),
                course.getCategorie(),
                course.getMatiere(),
                course.getOrdre(),
                course.getMiniature(),
                course.getUnite(),
                course.getPdf_fichier(),
                course.getUser().getPrenom() + " " + course.getUser().getNom()
        );
    }

    public List<CourseDTO> getCoursesByEtape(String etape) {
        return courseRepository.findByEtape(etape).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/etudiant/lycee")
    public List<CourseDTO> getAllLyceeCourses() {
        return getCoursesByEtape("Lycée");
    }

    @GetMapping("/etudiant/agregation")
    public List<CourseDTO> getAllCollegeCourses() {
        return getCoursesByEtape("Agrégation");
    }

    @GetMapping("/etudiant/license")
    public List<CourseDTO> getAllLicenseCourses() {
        return getCoursesByEtape("Licence");
    }

}
