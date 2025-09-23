package com.PcDirac_backend.PcDirac_backend.utils;

import com.PcDirac_backend.PcDirac_backend.user.User;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class FileStorageService {

    private final FileStorageUtil fileStorageUtil;

    public FileStorageService(FileStorageUtil fileStorageUtil) {
        this.fileStorageUtil = fileStorageUtil;
    }

    /**
     * Save a file to the correct user folder
     *
     * @param user     the user
     * @param file     the file to save
     * @param type     main folder type: profile, miniature, file, videos_miniature
     * @param category optional category (ignored for profile)
     * @return relative public path
     */
    public String saveUserFile(User user, MultipartFile file, String type, String category) throws IOException {
        // Ensure all folders exist
        String userFolder = fileStorageUtil.createUserFolders(user.getId(), user.getNom(), user.getPrenom());
        String userFolderName = user.getId() + "_" + user.getNom() + "_" + user.getPrenom();

        // Determine main folder
        String mainFolder = switch (type) {
            case "profile" -> "profile_" + userFolderName;
            case "miniature" -> "miniatures_" + userFolderName;
            case "file" -> "files_" + userFolderName;
            case "videos_miniature" -> "videos_miniature_" + userFolderName;
            default -> throw new IllegalArgumentException("Invalid file type: " + type);
        };

        // Build target directory (include category if applicable)
        File targetDir;
        if (category != null && !category.isBlank() && !type.equals("profile")) {
            targetDir = new File(userFolder + File.separator + mainFolder + File.separator + category);
        } else {
            targetDir = new File(userFolder + File.separator + mainFolder);
        }

        if (!targetDir.exists()) targetDir.mkdirs();

        // Save the file
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            originalFilename = "file_" + System.currentTimeMillis();
        }

        File dest = new File(targetDir, originalFilename);
        file.transferTo(dest);

        // Return relative path for frontend
        return dest.getAbsolutePath()
                .replace(fileStorageUtil.getBaseUploadDir(), "/uploads")
                .replace("\\", "/");
    }
}
