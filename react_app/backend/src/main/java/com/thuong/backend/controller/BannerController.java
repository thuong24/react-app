package com.thuong.backend.controller;

import com.thuong.backend.entity.Banner;
import com.thuong.backend.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
public class BannerController {

    @Autowired
    private BannerService bannerService;

   @GetMapping("/banners")
    public List<Banner> getBanners() {
        return bannerService.getAllBanners();
    }
}