package com.shareSphere.backend.repositories;

import com.shareSphere.backend.entity.Skill;
import com.shareSphere.backend.entity.Tool;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ToolRepository extends JpaRepository<Tool, Long> {
    List<Tool> findByUserId(String userId);
    Tool findByToolId(long toolId);
}
