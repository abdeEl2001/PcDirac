package com.PcDirac_backend.PcDirac_backend.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.List;

@Component
public class FileStorageUtil {

    @Value("${file.upload-dir}")
    private String baseUploadDir;

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

    public String createUserFolders(Long userId, String nom, String prenom) {
        String userFolderName = (userId + "_" + nom + "_" + prenom).replaceAll("\\s+", "_");
        String userFolderPath = baseUploadDir + File.separator + userFolderName;

        File userFolder = new File(userFolderPath);
        if (!userFolder.exists() && !userFolder.mkdirs()) {
            throw new RuntimeException("❌ Failed to create user folder: " + userFolderPath);
        }

        // Main folders
        String[] mainFolders = {
                "profile_" + userFolderName,
                "miniatures_" + userFolderName,
                "files_" + userFolderName,
                "videos_miniature_" + userFolderName
        };

        for (String mainFolder : mainFolders) {
            File folder = new File(userFolderPath, mainFolder);
            if (!folder.exists() && !folder.mkdirs()) {
                throw new RuntimeException("❌ Failed to create folder: " + folder.getAbsolutePath());
            }

            // Skip profile folder for category subfolders
            if (!mainFolder.startsWith("profile_")) {
                for (String cat : CATEGORIES) {
                    File catFolder = new File(folder, cat);
                    if (!catFolder.exists() && !catFolder.mkdirs()) {
                        throw new RuntimeException("❌ Failed to create category folder: " + catFolder.getAbsolutePath());
                    }
                }
            }
        }

        return userFolderPath;
    }
    public String getBaseUploadDir() {
        return baseUploadDir;
    }

}
