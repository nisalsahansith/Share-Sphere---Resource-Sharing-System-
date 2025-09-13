package com.shareSphere.backend.dto;

import com.shareSphere.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDto {
    private String accessToken;
    private String role;
    private String id;
    private User.Status status;
}
