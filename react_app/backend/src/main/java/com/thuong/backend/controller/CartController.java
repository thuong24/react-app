package com.thuong.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.thuong.backend.entity.CartItem;
import com.thuong.backend.service.CartService;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public CartItem addToCart(@RequestBody CartItem cartItem) {
        return cartService.addToCart(cartItem);
    }

    @GetMapping("/")
    public List<CartItem> getCartItems() {
        return cartService.getCartItems();
    }

    @DeleteMapping("/remove/{id}")
public ResponseEntity<Void> removeFromCart(@PathVariable Long id) {
    boolean removed = cartService.removeFromCart(id);
    return removed ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
}
    // Thêm phương thức lấy tất cả các sản phẩm trong giỏ hàng
    @GetMapping("/all")
    public List<CartItem> getAllCartItems() {
        return cartService.getAllCartItems();
    }

    // Thêm phương thức xóa tất cả sản phẩm trong giỏ hàng
    @DeleteMapping("/delete-all")
    public void deleteAllCartItems() {
        cartService.deleteAllCartItems();
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<CartItem> updateQuantity(@PathVariable Long id, @RequestBody Map<String, Integer> requestBody) {
    Integer quantity = requestBody.get("quantity");
    CartItem updatedItem = cartService.updateQuantity(id, quantity);
    return updatedItem != null ? ResponseEntity.ok(updatedItem) : ResponseEntity.notFound().build();
}


}
