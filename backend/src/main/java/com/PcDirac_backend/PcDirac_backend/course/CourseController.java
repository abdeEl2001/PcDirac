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
    private final String basePath = "/var/www/PcDirac/backend/uploads/";

    public CourseController(CourseService courseService,
                            UserRepository userRepository,
                            CourseRepository courseRepository) {
        this.courseService = courseService;
        this.userRepository = userRepository;
        this.courseRepository=courseRepository;
    }

    @PostMapping
    public ResponseEntity<?> addCourse(
            @RequestParam("titre") String titre,
            @RequestParam("niveau") String niveau,
            @RequestParam("categorie") String categorie,
            @RequestParam("matiere") String matiere,
            @RequestParam("ordre") String ordre,
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
            course.setUser(user);

            // Directories
            String miniatureDir = "/var/www/PcDirac/backend/uploads/miniature/";
            String pdfDir = "/var/www/PcDirac/backend/uploads/courses/";

            new File(miniatureDir).mkdirs();
            new File(pdfDir).mkdirs();

            // Save miniature
            if (miniature != null && !miniature.isEmpty()) {
                String miniatureFilename = System.currentTimeMillis() + "_" + miniature.getOriginalFilename();
                String miniaturePath = miniatureDir + miniatureFilename;
                miniature.transferTo(new File(miniaturePath));
                course.setMiniature("/uploads/miniature/" + miniatureFilename);
            }

            // Save PDF
            if (pdf_fichier != null && !pdf_fichier.isEmpty()) {
                String pdfFilename = System.currentTimeMillis() + "_" + pdf_fichier.getOriginalFilename();
                String pdfPath = pdfDir + pdfFilename;
                pdf_fichier.transferTo(new File(pdfPath));
                course.setPdf_fichier("/uploads/courses/" + pdfFilename);
            }

            // Save course to DB
            courseRepository.save(course);

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
            @RequestParam(value = "miniature", required = false) MultipartFile miniature,
            @RequestParam(value = "pdf_fichier", required = false) MultipartFile pdfFile
    ) throws IOException {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // update text fields
        course.setTitre(titre);
        course.setNiveau(niveau);
        course.setCategorie(categorie);
        course.setMatiere(matiere);
        course.setOrdre(ordre);

        // ✅ Handle miniature update
        if (miniature != null && !miniature.isEmpty()) {
            // delete old miniature
            if (course.getMiniature() != null) {
                File oldMiniature = new File("/var/www/PcDirac/backend/" + course.getMiniature());
                if (oldMiniature.exists()) {
                    oldMiniature.delete();
                }
            }
            // save new miniature
            String miniaturePath = "/var/www/PcDirac/backend/uploads/miniature/" + miniature.getOriginalFilename();
            miniature.transferTo(new File(miniaturePath));
            course.setMiniature("/uploads/miniature/" + miniature.getOriginalFilename());
        }

        // ✅ Handle pdf update
        if (pdfFile != null && !pdfFile.isEmpty()) {
            // delete old pdf
            if (course.getPdf_fichier() != null) {
                File oldPdf = new File("/var/www/PcDirac/backend" + course.getPdf_fichier());
                if (oldPdf.exists()) {
                    oldPdf.delete();
                }
            }
            // save new pdf
            String pdfPath = "/var/www/PcDirac/backend/uploads/courses/" + pdfFile.getOriginalFilename();
            pdfFile.transferTo(new File(pdfPath));
            course.setPdf_fichier("/uploads/courses/" + pdfFile.getOriginalFilename());
        }

        return ResponseEntity.ok(courseRepository.save(course));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            Course course = courseRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Course not found"));

            // ✅ Delete miniature if exists
            if (course.getMiniature() != null) {
                File miniatureFile = new File("/var/www/PcDirac/backend" + course.getMiniature());
                if (miniatureFile.exists()) {
                    miniatureFile.delete();
                }
            }

            // ✅ Delete pdf if exists
            if (course.getPdf_fichier() != null) {
                File pdfFile = new File("/var/www/PcDirac/backend" + course.getPdf_fichier());
                if (pdfFile.exists()) {
                    pdfFile.delete();
                }
            }

            // ✅ Delete course from DB
            courseRepository.delete(course);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Cours supprimé avec succès !");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erreur lors de la suppression du cours : " + e.getMessage());
        }
    }

    @GetMapping("/etudiant/cours")
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findByCategorie("Cours").stream()
                .map(course -> new CourseDTO(
                        course.getId(),
                        course.getTitre(),
                        course.getNiveau(),
                        course.getCategorie(),
                        course.getMatiere(),
                        course.getOrdre(),
                        course.getMiniature(),
                        course.getPdf_fichier(),
                        course.getUser().getPrenom() + " " + course.getUser().getNom()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/etudiant/exercice")
    public List<CourseDTO> getAllExercices() {
        return courseRepository.findByCategorie("Exercices").stream()
                .map(course -> new CourseDTO(
                        course.getId(),
                        course.getTitre(),
                        course.getNiveau(),
                        course.getCategorie(),
                        course.getMatiere(),
                        course.getOrdre(),
                        course.getMiniature(),
                        course.getPdf_fichier(),
                        course.getUser().getPrenom() + " " + course.getUser().getNom()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/etudiant/activitie")
    public List<CourseDTO> getAllActivities() {
        return courseRepository.findByCategorie("Activités").stream()
                .map(course -> new CourseDTO(
                        course.getId(),
                        course.getTitre(),
                        course.getNiveau(),
                        course.getCategorie(),
                        course.getMatiere(),
                        course.getOrdre(),
                        course.getMiniature(),
                        course.getPdf_fichier(),
                        course.getUser().getPrenom() + " " + course.getUser().getNom()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/etudiant/devoirSurveille")
    public List<CourseDTO> getAllDevoirSurveille() {
        return courseRepository.findByCategorie("Devoirs surveillés").stream()
                .map(course -> new CourseDTO(
                        course.getId(),
                        course.getTitre(),
                        course.getNiveau(),
                        course.getCategorie(),
                        course.getMatiere(),
                        course.getOrdre(),
                        course.getMiniature(),
                        course.getPdf_fichier(),
                        course.getUser().getPrenom() + " " + course.getUser().getNom()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/etudiant/documentsPedagogiques")
    public List<CourseDTO> getAllDocumentsPedagogiques() {
        return courseRepository.findByCategorie("Documents pédagogiques").stream()
                .map(course -> new CourseDTO(
                        course.getId(),
                        course.getTitre(),
                        course.getNiveau(),
                        course.getCategorie(),
                        course.getMatiere(),
                        course.getOrdre(),
                        course.getMiniature(),
                        course.getPdf_fichier(),
                        course.getUser().getPrenom() + " " + course.getUser().getNom()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/etudiant/examensNationaux")
    public List<CourseDTO> getAllExamensNationaux() {
        return courseRepository.findByCategorie("Examens Nationaux").stream()
                .map(course -> new CourseDTO(
                        course.getId(),
                        course.getTitre(),
                        course.getNiveau(),
                        course.getCategorie(),
                        course.getMatiere(),
                        course.getOrdre(),
                        course.getMiniature(),
                        course.getPdf_fichier(),
                        course.getUser().getPrenom() + " " + course.getUser().getNom()
                ))
                .collect(Collectors.toList());
    }



}