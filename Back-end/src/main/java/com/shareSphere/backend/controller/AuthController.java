package com.shareSphere.backend.controller;

import com.shareSphere.backend.dto.APIResponse;
import com.shareSphere.backend.dto.AuthDto;
import com.shareSphere.backend.dto.RegisterDto;
import com.shareSphere.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<APIResponse> registerUser(@RequestBody RegisterDto registerDto) {
        System.out.println("Registering user: " + registerDto.getUsername() + " with email: " + registerDto.getEmail());
        String message = authService.register(registerDto);
        return ResponseEntity.ok(new APIResponse(200, "OK", message));
    }


    @PostMapping("/login")
    public ResponseEntity<APIResponse> logInUser(@RequestBody AuthDto authDto){
        return ResponseEntity.ok(new APIResponse(
                200,
                "OK",
                authService.authentication(authDto)
        ));
    }
}
