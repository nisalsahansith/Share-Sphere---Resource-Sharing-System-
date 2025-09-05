package com.shareSphere.backend.service;

import com.shareSphere.backend.entity.User;
import com.shareSphere.backend.repositories.UserProfileRepository;
import com.shareSphere.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public Object getUserDetails(String userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("User not found")
        );
        return userProfileRepository.findByUserId(userId).orElseThrow(
                () -> new RuntimeException("User profile not found")
        );
    }
}
