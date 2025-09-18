package com.PcDirac_backend.PcDirac_backend.course;

import com.PcDirac_backend.PcDirac_backend.user.User;
import com.PcDirac_backend.PcDirac_backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "https://admin.pcdirac.com") // ✅ Allow frontend domain
public class CourseController {

    private final CourseService courseService;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    @Value("${file.upload-dir}")
    private String uploadDir; // ✅ Configurable path from application.properties

    public CourseController(CourseService courseService,
                            UserRepository userRepository,
                            CourseRepository courseRepository) {
        this.courseService = courseService;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    @PostMapping
    public ResponseEntity<?> addCourse(
            @RequestParam("titre") String titre,
            @RequestParam("niveau") String niveau,
            @RequestParam("categorie") String categorie,
            @RequestParam("matiere") String matiere,
            @RequestParam("ordre") String ordre,
            @RequestParam("unite") String unite,
            @RequestParam("miniature") MultipartFile miniature,
            @RequestParam("pdf_fichier") MultipartFile pdf_fichier,
            @RequestParam("userId") Long userId
    ) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Course course = new Course();
            course.setTitre(titre);
            course.setNiveau(niveau);
            course.setCategorie(categorie);
            course.setMatiere(matiere);
            course.setOrdre(ordre);
            course.setUnite(unite);
            course.setUser(user);

            // ✅ Save course and files via service
            courseService.saveCourse(course, miniature, pdf_fichier);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Cours ajouté avec succès !");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body("Erreur lors de l'ajout du cours : " + e.getMessage());
        }
    }

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

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Long id,
            @RequestParam("titre") String titre,
            @RequestParam("niveau") String niveau,
            @RequestParam("categorie") String categorie,
            @RequestParam("matiere") String matiere,
            @RequestParam("ordre") String ordre,
            @RequestParam(value = "unite", required = false) String unite,
            @RequestParam(value = "miniature", required = false) MultipartFile miniature,
            @RequestParam(value = "pdf_fichier", required = false) MultipartFile pdfFile
    ) throws IOException {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // ✅ Update text fields
        course.setTitre(titre);
        course.setNiveau(niveau);
        course.setCategorie(categorie);
        course.setMatiere(matiere);
        course.setOrdre(ordre);
        if (unite != null) course.setUnite(unite);

        // ✅ Handle miniature update
        if (miniature != null && !miniature.isEmpty()) {
            if (course.getMiniature() != null) {
                File oldMiniature = new File(uploadDir + course.getMiniature());
                if (oldMiniature.exists()) oldMiniature.delete();
            }
            String uniqueMiniature = UUID.randomUUID() + "_" + miniature.getOriginalFilename();
            File newMiniatureFile = new File(uploadDir + "/miniature/" + uniqueMiniature);
            miniature.transferTo(newMiniatureFile);
            course.setMiniature("/uploads/miniature/" + uniqueMiniature);
        }

        // ✅ Handle pdf update
        if (pdfFile != null && !pdfFile.isEmpty()) {
            if (course.getPdf_fichier() != null) {
                File oldPdf = new File(uploadDir + course.getPdf_fichier());
                if (oldPdf.exists()) oldPdf.delete();
            }
            String uniquePdf = UUID.randomUUID() + "_" + pdfFile.getOriginalFilename();
            File newPdfFile = new File(uploadDir + "/courses/" + uniquePdf);
            pdfFile.transferTo(newPdfFile);
            course.setPdf_fichier("/uploads/courses/" + uniquePdf);
        }

        return ResponseEntity.ok(courseRepository.save(course));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            Course course = courseRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Course not found"));

            if (course.getMiniature() != null) {
                File miniatureFile = new File(uploadDir + course.getMiniature());
                if (miniatureFile.exists()) miniatureFile.delete();
            }

            if (course.getPdf_fichier() != null) {
                File pdfFile = new File(uploadDir + course.getPdf_fichier());
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

    // ✅ Generic reusable method
    private List<CourseDTO> getCoursesByCategorie(String categorie) {
        return courseRepository.findByCategorie(categorie).stream()
                .map(course -> new CourseDTO(
                        course.getId(),
                        course.getTitre(),
                        course.getNiveau(),
                        course.getCategorie(),
                        course.getMatiere(),
                        course.getOrdre(),
                        course.getMiniature(),
                        course.getUnite(),
                        course.getPdf_fichier(),
                        course.getUser().getPrenom() + " " + course.getUser().getNom()
                ))
                .collect(Collectors.toList());
    }

    // ✅ Student endpoints using the generic method
    @GetMapping("/etudiant/cours")
    public List<CourseDTO> getAllCourses() {
        return getCoursesByCategorie("Cours");
    }

    @GetMapping("/etudiant/exercice")
    public List<CourseDTO> getAllExercices() {
        return getCoursesByCategorie("Exercices");
    }

    @GetMapping("/etudiant/activitie")
    public List<CourseDTO> getAllActivities() {
        return getCoursesByCategorie("Activités");
    }

    @GetMapping("/etudiant/devoirSurveille")
    public List<CourseDTO> getAllDevoirSurveille() {
        return getCoursesByCategorie("Devoirs surveillés");
    }

    @GetMapping("/etudiant/documentsPedagogiques")
    public List<CourseDTO> getAllDocumentsPedagogiques() {
        return getCoursesByCategorie("Documents pédagogiques");
    }

    @GetMapping("/etudiant/examensNationaux")
    public List<CourseDTO> getAllExamensNationaux() {
        return getCoursesByCategorie("Examens Nationaux");
    }
}
