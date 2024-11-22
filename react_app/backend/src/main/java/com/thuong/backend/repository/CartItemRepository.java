package com.thuong.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thuong.backend.entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByProductId(Long productId); 
}