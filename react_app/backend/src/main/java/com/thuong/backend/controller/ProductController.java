package com.thuong.backend.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.thuong.backend.entity.Product;
import com.thuong.backend.service.FileStorageService;
import com.thuong.backend.service.ProductService;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private FileStorageService fileStorageService; // Sử dụng service lưu file

    @GetMapping("/products")
    public List<Product> getProducts() {
        return productService.getAllProducts();
    }

    @PostMapping("/product")
    public ResponseEntity<Product> uploadProduct(
            @RequestParam("name") String name,
            @RequestParam("screen") String screen,
            @RequestParam("display") String display,
            @RequestParam("price") double price,
            @RequestParam("salePrice") double salePrice,
            @RequestParam("totalStock") Long totalStock,
            @RequestParam("stock") Long stock,
            @RequestParam("screenTechnology") String screenTechnology,
            @RequestParam("screenResolution") String screenResolution,
            @RequestParam("mainCamera") String mainCamera,
            @RequestParam("frontCamera") String frontCamera,
            @RequestParam("chipset") String chipset,
            @RequestParam("ram") String ram,
            @RequestParam("internalMemory") String internalMemory,
            @RequestParam("operatingSystem") String operatingSystem,
            @RequestParam("battery") String battery,
            @RequestParam("weight") String weight,
            @RequestParam("description") String description,
            @RequestParam("colors") List<String> colors,
            @RequestParam("files") List<MultipartFile> files) {
        List<String> imagePaths = new ArrayList<>();

        for (MultipartFile file : files) {
            String imagePath = fileStorageService.saveFile(file);
            if (imagePath != null) {
                imagePaths.add(imagePath);
            }
        }

        Product product = new Product();
        product.setName(name);
        product.setScreen(screen);
        product.setDisplay(display);
        product.setPrice(price);
        product.setSalePrice(salePrice);
        product.setTotalStock(totalStock);
        product.setStock(stock);
        product.setScreenTechnology(screenTechnology);
        product.setScreenResolution(screenResolution);
        product.setMainCamera(mainCamera);
        product.setFrontCamera(frontCamera);
        product.setChipset(chipset);
        product.setRam(ram);
        product.setInternalMemory(internalMemory);
        product.setOperatingSystem(operatingSystem);
        product.setBattery(battery);
        product.setWeight(weight);
        product.setDescription(description);
        product.setColors(colors); // Lưu danh sách các màu sắc
        product.setImagePaths(imagePaths); // Lưu nhiều đường dẫn hình ảnh
        Product savedProduct = productService.saveProduct(product);
        return ResponseEntity.ok(savedProduct);
    }
    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
    Product product = productService.getProductById(id);
    if (product != null) {
        return ResponseEntity.ok(product);
    } else {
        return ResponseEntity.notFound().build(); // Trả về 404 nếu không tìm thấy sản phẩm
    }
    }
    @GetMapping("/products/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategoryId(@PathVariable Long categoryId) {
        List<Product> products = productService.getProductsByCategoryId(categoryId);
        if (products.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(products);
    }
}