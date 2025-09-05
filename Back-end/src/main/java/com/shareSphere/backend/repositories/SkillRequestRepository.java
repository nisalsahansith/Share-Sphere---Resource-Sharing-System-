package com.shareSphere.backend.repositories;

import com.shareSphere.backend.entity.Skill;
import com.shareSphere.backend.entity.SkillRequest;
import com.shareSphere.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillRequestRepository extends JpaRepository<SkillRequest, Long> {
    List<SkillRequest> findSkillRequestByRequester(User user);

    List<SkillRequest> findSkillRequestBySkill(Skill skill);
}
