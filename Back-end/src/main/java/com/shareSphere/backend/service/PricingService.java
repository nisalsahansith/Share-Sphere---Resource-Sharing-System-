package com.shareSphere.backend.service;

import com.shareSphere.backend.dto.PricingDto;
import com.shareSphere.backend.entity.Pricing;
import com.shareSphere.backend.entity.Skill;
import com.shareSphere.backend.entity.Tool;
import com.shareSphere.backend.entity.User;
import com.shareSphere.backend.repositories.PricingRepository;
import com.shareSphere.backend.repositories.SkillRepository;
import com.shareSphere.backend.repositories.ToolRepository;
import com.shareSphere.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PricingService {
    private final PricingRepository pricingRepository;
    private final SkillRepository skillRepository;
    private final ToolRepository toolRepository;
    private final UserRepository userRepository;

    public String savePricing(PricingDto dto) {
        Pricing pricing = new Pricing();
        pricing.setPriceType(Pricing.PriceType.valueOf(dto.getPriceType()));
        pricing.setPrice(dto.getPrice());

        if (dto.getSkillId() != null) {
            Skill skill = skillRepository.findById(Long.valueOf(dto.getToolId()))
                    .orElseThrow(() -> new RuntimeException("Skill not found"));
            pricing.setSkill(skill);
        }

        if (dto.getToolId() != null) {
            Tool tool = toolRepository.findById(Long.valueOf(dto.getToolId()))
                    .orElseThrow(() -> new RuntimeException("Tool not found"));
            pricing.setTool(tool);
        }

        if (dto.getOwnerId() != null){
            User user = userRepository.findById(dto.getOwnerId())
                    .orElseThrow(()-> new RuntimeException("User not Found"));
            pricing.setOwner(user);
        }

        pricingRepository.save(pricing);
        return "Pricing saved successfully";
    }
}
