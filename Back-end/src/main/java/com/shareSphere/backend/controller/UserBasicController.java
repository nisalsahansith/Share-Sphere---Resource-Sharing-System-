package com.shareSphere.backend.controller;

import com.shareSphere.backend.dto.APIResponse;
import com.shareSphere.backend.service.EmailService;
import com.shareSphere.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/userbasic")
@RequiredArgsConstructor
public class UserBasicController {
    private final UserService userService;
    private final EmailService emailService;

    @GetMapping("/forgot-password")
    public ResponseEntity<APIResponse> forgotPassword(@RequestParam String email){
        emailService.generateOtp(email);
        return ResponseEntity.ok(new APIResponse(200,"OK","OTP send your email"));
    }

    @PostMapping("/reset-password-with-otp")
    public ResponseEntity<APIResponse> resetPasswordWithOtp(@RequestParam String email,
                                                       @RequestParam String otp,
                                                       @RequestParam String newPassword) {
        userService.resetPassword(email,otp,newPassword);
        return ResponseEntity.ok(new APIResponse(200,"OK","Password updated successfully"));
    }

}
