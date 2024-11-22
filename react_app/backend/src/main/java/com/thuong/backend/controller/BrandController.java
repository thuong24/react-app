package com.thuong.backend.controller;

import com.thuong.backend.entity.Brand;
import com.thuong.backend.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
@RequestMapping("/api")
public class BrandController {

    @Autowired
    private BrandService brandService;

    @GetMapping("/brands/{id}")
    public List<Brand> getBrandsByCategory(@PathVariable Long id) {
        return brandService.getBrandsByCategoryId(id);
    }
}