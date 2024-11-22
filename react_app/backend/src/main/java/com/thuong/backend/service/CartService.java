package com.thuong.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thuong.backend.entity.CartItem;
import com.thuong.backend.repository.CartItemRepository;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    public CartItem addToCart(CartItem cartItem) {
        // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
        List<CartItem> existingItems = cartItemRepository.findByProductId(cartItem.getProductId());
    
        for (CartItem existingItem : existingItems) {
            // Kiểm tra xem sản phẩm có cùng màu sắc và hình ảnh không
            if (existingItem.getSelectedColor().equals(cartItem.getSelectedColor()) && 
                existingItem.getSelectedImagePath().equals(cartItem.getSelectedImagePath())) {
                // Nếu cùng màu và hình ảnh, cập nhật số lượng
                existingItem.setQuantity(existingItem.getQuantity() + cartItem.getQuantity());
                // Giữ giá cố định mà không cần tính toán lại
                return cartItemRepository.save(existingItem); // Cập nhật vào database
            }
        }
    
        // Bạn có thể lấy giá gốc từ cartItem nếu nó là sản phẩm mới
        return cartItemRepository.save(cartItem);
    }
    
    
    
    public List<CartItem> getCartItems() {
        return cartItemRepository.findAll();
    }


    public boolean removeFromCart(Long itemId) {
        // Tìm sản phẩm trong danh sách giỏ hàng
        CartItem cartItem = cartItemRepository.findById(itemId).orElse(null);
        if (cartItem != null) {
            cartItemRepository.delete(cartItem); // Xóa sản phẩm
            return true; // Trả về true nếu xóa thành công
        }
        return false; // Trả về false nếu không tìm thấy sản phẩm
    }
    // Phương thức mới để lấy tất cả các sản phẩm trong giỏ hàng
    public List<CartItem> getAllCartItems() {
        return cartItemRepository.findAll();
    }

    // Phương thức mới để xóa tất cả sản phẩm trong giỏ hàng
    public void deleteAllCartItems() {
        cartItemRepository.deleteAll();
    }
    public CartItem updateQuantity(Long id, int quantity) {
        // Tìm kiếm sản phẩm trong giỏ hàng
        CartItem item = cartItemRepository.findById(id).orElse(null);
        if (item != null) {
            item.setQuantity(quantity); // Cập nhật số lượng
            return cartItemRepository.save(item); // Lưu sản phẩm đã cập nhật
        }
        return null; // Trả về null nếu không tìm thấy sản phẩm
    }
}