package com.thuong.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.thuong.backend.entity.User;
import com.thuong.backend.repository.UserRepository;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

   // Phương thức tìm người dùng theo email và số điện thoại
   public User findByEmailAndPhone(String email, String phone) {
    return userRepository.findByEmailAndPhone(email, phone);
}
// Tìm kiếm người dùng theo email
public User findByEmail(String email) {
    return userRepository.findByEmail(email);
}

// Tìm kiếm người dùng theo số điện thoại
public User findByPhone(String phone) {
    return userRepository.findByPhone(phone);
}
}
