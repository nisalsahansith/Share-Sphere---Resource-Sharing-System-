package com.shareSphere.backend.repositories;

import com.shareSphere.backend.entity.User;
import com.shareSphere.backend.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, String> {
    Optional<UserProfile> findByUserId(String userId);

    Optional<Object> findByUser(User user);
}
