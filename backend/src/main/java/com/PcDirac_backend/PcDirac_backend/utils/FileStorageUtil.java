package com.PcDirac_backend.PcDirac_backend.utils;

import java.io.File;

public class FileStorageUtil {

    public static String createUserFolders(String basePath, String nom, String prenom) {
        String userFolderName = nom + "_" + prenom;  // e.g. "imtki_hicham"
        String userFolderPath = basePath + File.separator + userFolderName;

        File userFolder = new File(userFolderPath);
        if (!userFolder.exists()) {
            userFolder.mkdirs();
        }

        // Subfolders
        String profileFolder = userFolderPath + File.separator + "profile_" + userFolderName;
        String miniatureFolder = userFolderPath + File.separator + "miniatures_" + userFolderName;
        String filesFolder = userFolderPath + File.separator + "files_" + userFolderName;
        String videosMiniatureFolder = userFolderPath + File.separator + "videos_miniature_" + userFolderName;

        new File(profileFolder).mkdirs();
        new File(miniatureFolder).mkdirs();
        new File(filesFolder).mkdirs();
        new File(videosMiniatureFolder).mkdirs();

        return userFolderPath;
    }
}
