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

    private final FileStorageUtil fileStorageUtil;

    public FileStorageService(FileStorageUtil fileStorageUtil) {
        this.fileStorageUtil = fileStorageUtil;
    }

    public String saveUserFile(User user, MultipartFile file, String type) throws IOException {
        // Use the instance to create folders
        String userFolder = fileStorageUtil.createUserFolders(user.getId(), user.getNom(), user.getPrenom());
        String userFolderName = user.getId() + "_" + user.getNom() + "_" + user.getPrenom();

        String targetDir = switch (type) {
            case "profile" -> userFolder + File.separator + "profile_" + userFolderName;
            case "miniature" -> userFolder + File.separator + "miniatures_" + userFolderName;
            case "file" -> userFolder + File.separator + "files_" + userFolderName;
            case "videos_miniature" -> userFolder + File.separator + "videos_miniature_" + userFolderName;
            default -> throw new IllegalArgumentException("Invalid file type: " + type);
        };

        File dir = new File(targetDir);
        if (!dir.exists()) dir.mkdirs();

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            originalFilename = "file_" + System.currentTimeMillis();
        }

        File dest = new File(dir, originalFilename);
        file.transferTo(dest);

        return dest.getAbsolutePath()
                .replace(fileStorageUtil.getBaseUploadDir(), "/uploads")
                .replace("\\", "/");
    }
}


