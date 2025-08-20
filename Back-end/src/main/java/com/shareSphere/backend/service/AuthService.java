package com.shareSphere.backend.service;

import com.shareSphere.backend.dto.AuthDto;
import com.shareSphere.backend.dto.AuthResponseDto;
import com.shareSphere.backend.dto.RegisterDto;
import com.shareSphere.backend.entity.Role;
import com.shareSphere.backend.entity.User;
import com.shareSphere.backend.exceptions.UserAlreadyExistsException;
import com.shareSphere.backend.repositories.UserRepository;
import com.shareSphere.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponseDto authentication(AuthDto authDto){
        User user = userRepository.findByEmail(authDto.getEmail())
                .orElseThrow(()->new UsernameNotFoundException("User email not Found"));

        if (!passwordEncoder.matches(authDto.getPassword(),user.getPassword())){
            throw new BadCredentialsException("Password incorrect");
        }

        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponseDto(token,user.getRole().name());
    }

    public String register(RegisterDto registerDto){
        if (userRepository.findByEmail(
                registerDto.getEmail()).isPresent()){
            throw new UserAlreadyExistsException("Email already registered");
        }

        User user = User.builder()
                .username(registerDto.getUsername())
                .password(passwordEncoder.encode(
                        registerDto.getPassword()
                ))
                .email(registerDto.getEmail())
                .role(Role.valueOf(registerDto.getRole()))
                .build();
        userRepository.save(user);
        return "User registration Success";
    }
}
