package com.shareSphere.backend.repositories;

import com.shareSphere.backend.entity.Pricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface PricingRepository extends JpaRepository<Pricing,UUID> {
    @Query("SELECT p FROM Pricing p JOIN FETCH p.tool t WHERE t.toolId = :toolId")
    Optional<Pricing> findByToolId(@Param("toolId") Long toolId);

    @Query("SELECT p FROM Pricing p JOIN FETCH p.skill s WHERE s.skillId = :skillId")
    Optional<Pricing> findBySkillId(@Param("skillId") Long skillId);

    Optional<Pricing> findById(UUID pricingId);
}
