package com.PcDirac_backend.PcDirac_backend.course;


import com.PcDirac_backend.PcDirac_backend.user.User;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    private final String basePath = "file:/var/www/PcDirac/backend/uploads/";

    public Course saveCourse(Course course, MultipartFile thumbnail, MultipartFile pdfFile) throws IOException {
        if (thumbnail != null) {
            String thumbnailPath = basePath + "miniature/" + thumbnail.getOriginalFilename();
            File thumbnailFile = new File(thumbnailPath);
            thumbnail.getBytes();
            thumbnail.transferTo(thumbnailFile);
            course.setMiniature("/uploads/miniature/" + thumbnail.getOriginalFilename());
        }

        if (pdfFile != null) {
            String pdfPath = basePath + "courses/" + pdfFile.getOriginalFilename();
            File pdfDest = new File(pdfPath);
            pdfFile.transferTo(pdfDest);
            course.setPdf_fichier("/uploads/courses/" + pdfFile.getOriginalFilename());
        }

        return courseRepository.save(course);
    }

    public List<Course> getCoursesByUser(User user) {
        return courseRepository.findByUser(user);
    }
}
