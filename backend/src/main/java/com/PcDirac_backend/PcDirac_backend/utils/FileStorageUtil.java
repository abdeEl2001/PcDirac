package com.PcDirac_backend.PcDirac_backend.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.List;

@Component
public class FileStorageUtil {

    @Value("${file.upload-dir}")
    private String baseUploadDir;

    // List of categories
    private static final List<String> CATEGORIES = List.of(
            "Cours",
            "Exercices",
            "Activités",
            "Devoirs Surveillés",
            "Documents Pédagogiques",
            "Examens Nationaux",
            "Cours Licence",
            "Travaux dirigés",
            "Concours d'entrée",
            "Concours de sortie",
            "Rapport de jury",
            "Leçons physique",
            "Leçons chimie",
            "Montage physique"
    );

    /**
     * Create user folder structure with categories
     * Example:
     * 1_El_Abdelhadi/
     * ├─ miniatures_1_El_Abdelhadi/
     * │  ├─ Cours/
     * │  ├─ Exercices/
     * │  └─ ...
     * ├─ files_1_El_Abdelhadi/
     * │  ├─ Cours/
     * │  └─ ...
     * └─ videos_miniature_1_El_Abdelhadi/
     *    ├─ Cours/
     *    └─ ...
     */
    public String createUserFolders(Long userId, String nom, String prenom) {
        String userFolderName = (userId + "_" + nom + "_" + prenom).replaceAll("\\s+", "_");
        String userFolderPath = baseUploadDir + File.separator + userFolderName;

        File userFolder = new File(userFolderPath);
        if (!userFolder.exists() && !userFolder.mkdirs()) {
            throw new RuntimeException("❌ Failed to create user folder: " + userFolderPath);
        }

        // Main folders (profile removed ✅)
        String[] mainFolders = {
                "miniatures_" + userFolderName,
                "files_" + userFolderName,
                "videos_miniature_" + userFolderName
        };

        for (String mainFolder : mainFolders) {
            File folder = new File(userFolderPath, mainFolder);
            if (!folder.exists() && !folder.mkdirs()) {
                throw new RuntimeException("❌ Failed to create folder: " + folder.getAbsolutePath());
            }

            // Add categories
            for (String cat : CATEGORIES) {
                File catFolder = new File(folder, cat);
                if (!catFolder.exists() && !catFolder.mkdirs()) {
                    throw new RuntimeException("❌ Failed to create category folder: " + catFolder.getAbsolutePath());
                }
            }
        }

        return userFolderPath;
    }

    public String getBaseUploadDir() {
        return baseUploadDir;
    }
}
