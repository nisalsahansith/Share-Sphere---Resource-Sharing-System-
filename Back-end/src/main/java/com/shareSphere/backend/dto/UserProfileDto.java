package com.shareSphere.backend.dto;

import com.shareSphere.backend.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class UserProfileDto {
        private String id;
        private String firstName;
        private String lastName;
        private String mobile;
        private String address;
        private String userImage;
        private User user;
    }


