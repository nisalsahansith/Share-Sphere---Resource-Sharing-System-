package com.shareSphere.backend.repositories;

import com.shareSphere.backend.dto.SkillDto;
import com.shareSphere.backend.dto.ToolDto;
import com.shareSphere.backend.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillRepository extends JpaRepository<Skill,Long> {
    List<Skill> findByUserId(String userId);
    Skill findBySkillId(Long skillID);
}
