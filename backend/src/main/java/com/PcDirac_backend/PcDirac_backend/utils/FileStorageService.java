package com.PcDirac_backend.PcDirac_backend.utils;

import com.PcDirac_backend.PcDirac_backend.user.User;
import com.PcDirac_backend.PcDirac_backend.utils.FileStorageUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String baseUploadDir; // e.g., /var/www/PcDirac/backend/uploads/

    @Value("${spring.web.resources.static-locations}")
    private String staticLocation; // e.g., file:/var/www/PcDirac/backend/uploads/

    /**
     * Save user file and return a public relative path (to be used on frontend)
     */
    public String saveUserFile(User user, MultipartFile file, String type, String category) throws IOException {
        Long userId = user.getId();
        String nom = user.getNom();
        String prenom = user.getPrenom();

        // Create user folders (with ID)
        String userFolder = FileStorageUtil.createUserFolders(userId, nom, prenom);
        String userFolderName = userId + "_" + nom + "_" + prenom;

        // Determine target directory
        String targetDir = switch (type) {
            case "profile" -> userFolder + File.separator + "profile_" + userFolderName;
            case "miniature" -> userFolder + File.separator + "miniatures_" + userFolderName + File.separator + category;
            case "file" -> userFolder + File.separator + "files_" + userFolderName + File.separator + category;
            case "videos_miniature" -> userFolder + File.separator + "videos_miniature_" + userFolderName + File.separator + category;
            default -> throw new IllegalArgumentException("Invalid file type: " + type);
        };

        File dir = new File(targetDir);
        if (!dir.exists()) dir.mkdirs();

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) originalFilename = "file_" + System.currentTimeMillis();
        File dest = new File(dir, originalFilename);
        file.transferTo(dest);

        // Return relative path for frontend
        String relativePath = dest.getAbsolutePath()
                .replace(baseUploadDir, "/uploads")
                .replace("\\", "/");

        return relativePath;
    }
}

