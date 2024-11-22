package com.thuong.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.thuong.backend.entity.User;
import com.thuong.backend.service.UserService;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User savedUser = userService.saveUser(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    // Phương thức lấy tất cả người dùng
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/login")
public ResponseEntity<?> loginUser(@RequestParam String email, @RequestParam String phone) {
    User userByEmail = userService.findByEmail(email); // Tìm theo email
    User userByPhone = userService.findByPhone(phone); // Tìm theo phone

    if (userByEmail == null) {
        return new ResponseEntity<>("Email không tồn tại", HttpStatus.NOT_FOUND);
    }

    if (userByPhone == null) {
        return new ResponseEntity<>("Số điện thoại không tồn tại", HttpStatus.NOT_FOUND);
    }

    if (userByEmail.getId().equals(userByPhone.getId())) {
        return new ResponseEntity<>(userByEmail, HttpStatus.OK);
    } else {
        return new ResponseEntity<>("Email và số điện thoại không khớp", HttpStatus.BAD_REQUEST);
    }
}

}
