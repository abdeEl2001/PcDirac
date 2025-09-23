package com.PcDirac_backend.PcDirac_backend.course;
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
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final FileStorageService fileStorageService;

    // Base upload directory
    private final String UPLOAD_DIR = "/var/www/PcDirac/backend/uploads/";

    public CourseController(CourseService courseService,
                            UserRepository userRepository,
                            CourseRepository courseRepository,
                            FileStorageService fileStorageService) {
        this.courseService = courseService;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.fileStorageService=fileStorageService;
    }

    // Utility: create user folders
    private String[] createUserFolders(User user) {
        String userFolderName = user.getNom() + "_" + user.getPrenom();
        String basePath = UPLOAD_DIR + userFolderName;

        String profileDir = basePath + "/profile_" + userFolderName;
        String miniatureDir = basePath + "/miniatures_" + userFolderName;
        String filesDir = basePath + "/files_" + userFolderName;

        new File(profileDir).mkdirs();
        new File(miniatureDir).mkdirs();
        new File(filesDir).mkdirs();

        return new String[]{profileDir, miniatureDir, filesDir};
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

            // Save miniature using FileStorageService (will create all folders + categories)
            if (miniature != null && !miniature.isEmpty()) {
                String miniaturePath = fileStorageService.saveUserFile(user, miniature, "miniature", categorie);
                course.setMiniature(miniaturePath);
            }

            // Save PDF using FileStorageService (will create all folders + categories)
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
        String[] userFolders = createUserFolders(user);
        String miniatureDir = userFolders[1];
        String filesDir = userFolders[2];
        String userFolderName = user.getNom() + "_" + user.getPrenom();

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
                File oldMiniature = new File(miniatureDir + "/" + new File(course.getMiniature()).getName());
                if (oldMiniature.exists()) oldMiniature.delete();
            }
            String miniaturePath = miniatureDir + "/" + miniature.getOriginalFilename();
            miniature.transferTo(new File(miniaturePath));
            course.setMiniature("/uploads/" + userFolderName + "/miniatures_" + userFolderName + "/" + miniature.getOriginalFilename());
        }

        // Update PDF
        if (pdfFile != null && !pdfFile.isEmpty()) {
            if (course.getPdf_fichier() != null) {
                File oldPdf = new File(filesDir + "/" + new File(course.getPdf_fichier()).getName());
                if (oldPdf.exists()) oldPdf.delete();
            }
            String pdfPath = filesDir + "/" + pdfFile.getOriginalFilename();
            pdfFile.transferTo(new File(pdfPath));
            course.setPdf_fichier("/uploads/" + userFolderName + "/files_" + userFolderName + "/" + pdfFile.getOriginalFilename());
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
            String[] userFolders = createUserFolders(user);
            String miniatureDir = userFolders[1];
            String filesDir = userFolders[2];

            // Delete miniature
            if (course.getMiniature() != null) {
                File miniatureFile = new File(miniatureDir + "/" + new File(course.getMiniature()).getName());
                if (miniatureFile.exists()) miniatureFile.delete();
            }

            // Delete PDF
            if (course.getPdf_fichier() != null) {
                File pdfFile = new File(filesDir + "/" + new File(course.getPdf_fichier()).getName());
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
