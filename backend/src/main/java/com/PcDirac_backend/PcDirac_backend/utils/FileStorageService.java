package com.PcDirac_backend.PcDirac_backend.utils;

import com.PcDirac_backend.PcDirac_backend.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String baseUploadDir;

    private static final Set<String> ALLOWED_TYPES = Set.of("profile", "miniature", "file", "videos_miniature");

    public String saveUserFile(User user, MultipartFile file, String type) throws IOException {
        String nom = user.getNom();
        String prenom = user.getPrenom();

        // Validate file type
        if (!ALLOWED_TYPES.contains(type)) {
            throw new IllegalArgumentException("Invalid file type: " + type);
        }

        // Validate file content
        if (file.isEmpty()) {
            throw new IOException("Empty file not allowed.");
        }
        if (file.getSize() > 10 * 1024 * 1024) { // 10MB limit
            throw new IOException("File too large. Max allowed size is 10MB.");
        }

        // Create user folder (e.g., /uploads/Nom_Prenom)
        String userFolderName = nom + "_" + prenom;
        String userFolder = FileStorageUtil.createUserFolders(baseUploadDir, nom, prenom);

        // Create sub-folder for the file type (e.g., /uploads/Nom_Prenom/profile/)
        String targetDir = userFolder + File.separator + type;
        File dir = new File(targetDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = (originalFilename != null && originalFilename.contains("."))
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String uniqueFilename = System.currentTimeMillis() + "_" + UUID.randomUUID() + extension;

        // Save file
        File dest = new File(dir, uniqueFilename);
        file.transferTo(dest);

        // Return relative path (cleaner than absolute path)
        return userFolderName + "/" + type + "/" + uniqueFilename;
    }
}
