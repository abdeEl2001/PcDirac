package com.PcDirac_backend.PcDirac_backend.course;



import com.PcDirac_backend.PcDirac_backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByUserId(Long userId);
    List<Course> findByUser(User user);
    List<Course> findByCategorie(String categorie);
}