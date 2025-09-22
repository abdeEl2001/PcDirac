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
    private String baseUploadDir;

    public String saveUserFile(User user, MultipartFile file, String type) throws IOException {
        String nom = user.getNom();
        String prenom = user.getPrenom();

        // Create personal folders if not already created
        String userFolder = FileStorageUtil.createUserFolders(baseUploadDir, nom, prenom);
        String userFolderName = nom + "_" + prenom;

        String targetDir;
        switch (type) {
            case "profile":
                targetDir = userFolder + File.separator + "profile_" + userFolderName;
                break;
            case "miniature":
                targetDir = userFolder + File.separator + "miniatures_" + userFolderName;
                break;
            case "file":
                targetDir = userFolder + File.separator + "files_" + userFolderName;
                break;
            case "videos_miniature":
                targetDir = userFolder + File.separator + "videos_miniature_" + userFolderName;
                break;
            default:
                throw new IllegalArgumentException("Invalid file type: " + type);
        }

        // Ensure the target directory exists
        File dir = new File(targetDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // Save file
        File dest = new File(dir, file.getOriginalFilename());
        file.transferTo(dest);

        return dest.getAbsolutePath(); // You may store relative path instead
    }
}
