package com.PcDirac_backend.PcDirac_backend.utils;

import java.io.File;
import java.io.IOException;

public class FileStorageUtil {

    public static String createUserFolders(String basePath, String nom, String prenom) {
        // Keep original capitalization, replace spaces with underscores
        String userFolderName = (nom + "_" + prenom).replaceAll("\\s+", "_");
        String userFolderPath = basePath + File.separator + userFolderName;

        File userFolder = new File(userFolderPath);
        if (!userFolder.exists() && !userFolder.mkdirs()) {
            throw new RuntimeException("❌ Failed to create user folder: " + userFolderPath);
        }

        // Define subfolder names
        String[] subFolders = {
                "profile_" + userFolderName,
                "miniatures_" + userFolderName,
                "files_" + userFolderName,
                "videos_miniature_" + userFolderName
        };

        // Create each subfolder
        for (String folder : subFolders) {
            File subFolder = new File(userFolderPath, folder);
            if (!subFolder.exists() && !subFolder.mkdirs()) {
                throw new RuntimeException("❌ Failed to create subfolder: " + subFolder.getAbsolutePath());
            }
        }

        return userFolderPath;
    }
}
