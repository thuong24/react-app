package com.thuong.backend.service;

import com.thuong.backend.entity.Brand;
import com.thuong.backend.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;

    public List<Brand> getBrandsByCategoryId(Long id) {
        return brandRepository.findAll()
                .stream()
                .filter(brand -> brand.getCategory().getId().equals(id))
                .toList();
    }
}
