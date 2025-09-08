package com.shareSphere.backend.service;

import com.shareSphere.backend.entity.User;
import com.shareSphere.backend.entity.UserProfile;
import com.shareSphere.backend.repositories.UserProfileRepository;
import com.shareSphere.backend.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private CloudService cloudService;


    public Object getUserDetails(String userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("User not found")
        );
        return userProfileRepository.findByUserId(userId).orElseThrow(
                () -> new RuntimeException("User profile not found")
        );
    }

    @Transactional
    public Object uploadUserDetails(String userId, String firstName, String lastName, String mobile, String address, String currentPassword, String newPassword, MultipartFile userImage) {
        User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not Found"));

        UserProfile userProfile = userProfileRepository.findByUserId(userId).orElseThrow(()->new RuntimeException("User Profile not found"));
        // Update basic info
        userProfile.setFirstName(firstName);
        userProfile.setLastName(lastName);
        userProfile.setMobile(mobile);
        userProfile.setAddress(address);

        if (userImage != null) {
            String imgUrl = uploadMultipleFiles(userImage);
            userProfile.setUserImage(imgUrl);
        }

        // Update password if provided
        if(newPassword != null && !newPassword.isEmpty()) {
            if(currentPassword == null || !passwordEncoder.matches(currentPassword, user.getPassword())) {
                return new BadRequestException( "Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        userRepository.save(user);
        userProfileRepository.save(userProfile);
        return "User profile update successful";
    }

    public String uploadMultipleFiles(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null; // no file uploaded
        }
        String imageUrls = "";
            try {
                imageUrls = cloudService.uploadFile(file);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image: " + file.getOriginalFilename(), e);
            }

        return imageUrls;
    }


}
