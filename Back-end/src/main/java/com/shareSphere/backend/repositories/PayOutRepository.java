package com.shareSphere.backend.repositories;

import com.shareSphere.backend.entity.Payout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PayOutRepository extends JpaRepository<Payout, UUID> {
}
