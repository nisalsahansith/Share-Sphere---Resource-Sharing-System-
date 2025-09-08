package com.shareSphere.backend.service;

import com.shareSphere.backend.entity.OTP;
import com.shareSphere.backend.entity.User;
import com.shareSphere.backend.repositories.OTPRepository;
import com.shareSphere.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    private final OTPRepository otpRepository;
    private final UserRepository userRepository;

    public void sendOTP(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP for password reset is: " + otp + "\nIt is valid for 5 minutes.");
        mailSender.send(message);
    }

    public void generateOtp(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(
                ()-> new RuntimeException("User not found")
        );
        String otp = String.valueOf(new Random().nextInt(900000) + 100000); // 6-digit OTP
        OTP OTPEntity = new OTP();
        OTPEntity.setEmail(user.getEmail());
        OTPEntity.setOtp(otp);
        OTPEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpRepository.save(OTPEntity);

        sendOTP(email, otp);
    }

}
