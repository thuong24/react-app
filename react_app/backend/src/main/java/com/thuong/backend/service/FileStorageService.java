package com.thuong.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;


@Component
public class FileStorageService {

    // Đường dẫn thư mục lưu ảnh được cấu hình trong application.properties
    @Value("${file.upload-dir}")
    private String uploadDir;

    // Phương thức lưu file và trả về đường dẫn file đã lưu
    public String saveFile(MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename(); // Lấy tên file gốc
            Path filePath = Paths.get(uploadDir, fileName); // Tạo đường dẫn lưu trữ file
            
            // Lưu file vào đường dẫn đã định nghĩa
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Trả về đường dẫn tương đối của file
            return fileName;
        } catch (IOException e) {
            e.printStackTrace();
            return null; // Trả về null nếu có lỗi khi lưu file
        }
    }
}
