package com.shareSphere.backend.dto;

import com.shareSphere.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDto {
    private String username;
    private String password;
    private String email;
    private String role;
    private User.Status status;
}
