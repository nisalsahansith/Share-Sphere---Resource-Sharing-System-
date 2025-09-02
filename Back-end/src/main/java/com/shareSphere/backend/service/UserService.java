package com.shareSphere.backend.service;

import com.shareSphere.backend.entity.User;
import com.shareSphere.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public String getUserId(String email) {
        return userRepository.findByEmail(email)
                .map(User::getId) // assuming userId is Long/UUID
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

}
