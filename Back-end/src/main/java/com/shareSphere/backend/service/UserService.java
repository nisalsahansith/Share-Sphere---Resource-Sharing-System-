package com.shareSphere.backend.service;

import com.shareSphere.backend.entity.User;
import com.shareSphere.backend.entity.OTP;
import com.shareSphere.backend.repositories.OTPRepository;
import com.shareSphere.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final OTPRepository otpRepository;
    private final PasswordEncoder passwordEncoder;

    public String getUserId(String email) {
        return userRepository.findByEmail(email)
                .map(User::getId) // assuming userId is Long/UUID
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }


    public String getUserName(UUID userId) {
        return userRepository.findById(String.valueOf(userId))
                .map(User::getUsername)
                .orElseThrow(() -> new RuntimeException("User not found for id: " + userId));
    }


    public void resetPassword(String email, String otp, String newPassword) {
        OTP otpEntity = otpRepository.findByEmailAndOtp(email, otp)
                .orElseThrow(() -> new RuntimeException("Invalid OTP"));

        if(otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        otpRepository.delete(otpEntity);
    }

    public String blockUser(String userId) {
        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not Found"));
        user.setStatus(User.Status.BLOCK);
        userRepository.save(user);
        return "User is Blocked";
    }

    public Object unblockUser(String userId) {
        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not Found"));
        user.setStatus(User.Status.ACTIVE);
        userRepository.save(user);
        return "User is Unblocked";
    }

    public Object userDelete(String userId) {
        User user = userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not Found"));
        userRepository.delete(user);
        return "User Deleted successfully";
    }
}
