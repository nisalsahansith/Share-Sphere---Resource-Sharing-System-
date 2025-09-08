package com.shareSphere.backend.repositories;

import com.shareSphere.backend.entity.OTP;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OTPRepository extends JpaRepository<OTP,Long> {
    Optional<OTP> findByEmailAndOtp(String string, String otp);
}
