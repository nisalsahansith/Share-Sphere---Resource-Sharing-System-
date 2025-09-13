package com.shareSphere.backend.service;

import com.shareSphere.backend.dto.PricingDto;
import com.shareSphere.backend.dto.SkillDto;
import com.shareSphere.backend.entity.Pricing;
import com.shareSphere.backend.entity.Skill;
import com.shareSphere.backend.entity.User;
import com.shareSphere.backend.repositories.PricingRepository;
import com.shareSphere.backend.repositories.SkillRepository;
import com.shareSphere.backend.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillService {
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final PricingRepository pricingRepository;
    @Autowired
    private CloudService cloudService;


    @Transactional
    public String postASkill(SkillDto skillDto, MultipartFile[] images, PricingDto pricingDto) {
        List<String> imageUrls = uploadMultipleFiles(images);

        UUID userId = UUID.fromString(skillDto.getUserId());
        User user = userRepository.findById(String.valueOf(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        Skill skill = Skill.builder()
                .name(skillDto.getName())
                .description(skillDto.getDescription())
                .availability(skillDto.getAvailability())
                .createdAt(LocalDateTime.now())
                .startDate(skillDto.getStartDate())
                .endDate(skillDto.getEndDate())
                .user(user)
                .imageUrls(imageUrls) // Make sure Skill entity has List<String> imageUrls
                .build();

        skillRepository.save(skill);

        Pricing pricing = Pricing.builder()
                .priceType(Pricing.PriceType.valueOf(pricingDto.getPriceType()))
                .price(pricingDto.getPrice())
                .skill(skill) // Associate pricing with the newly created skill
                .owner(user) // Assuming the owner is the same as the user posting the skill
                .build();

        pricingRepository.save(pricing);

        return "Skill posted successfully!";
    }



    public List<String> uploadMultipleFiles(MultipartFile[] files) {
        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                String url = cloudService.uploadFile(file);
                imageUrls.add(url);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image: " + file.getOriginalFilename(), e);
            }
        }
        return imageUrls;
    }


    public List<SkillDto> getSkillByUserId(String userId) {
        List<Skill> skills = skillRepository.findByUserId(userId);
        return skills.stream().map(skill ->
                    SkillDto.builder()
                    .skillId(skill.getSkillId())
                    .userId(skill.getUser().getId())
                    .name(skill.getName())
                    .description(skill.getDescription())
                    .availability(skill.getAvailability())
                    .createdAt(skill.getCreatedAt())
                    .startDate(skill.getStartDate())
                    .endDate(skill.getEndDate())
                    .imageUrls(skill.getImageUrls())
                    .build()
        ).collect(Collectors.toList());
    }

    public SkillDto findBySkillId(String skillId) {
        Pricing pricing = pricingRepository.findBySkillId(Long.valueOf(skillId))
                .orElseThrow(() -> new RuntimeException("No pricing found for toolId: " + skillId));

        Skill skill = pricing.getSkill();
        if (skill == null) {
            return null;
        }
        return SkillDto.builder()
                .skillId(skill.getSkillId())
                .userId(skill.getUser().getId())
                .name(skill.getName())
                .description(skill.getDescription())
                .availability(skill.getAvailability())
                .createdAt(skill.getCreatedAt())
                .startDate(skill.getStartDate())
                .endDate(skill.getEndDate())
                .imageUrls(skill.getImageUrls())
                .pricingId(pricing.getPricingId())
                .price(pricing.getPrice())
                .priceType(pricing.getPriceType())
                .build();

    }

    public String updateTheSkill(SkillDto skillDto, MultipartFile[] images, PricingDto pricingDto) {
        Skill existingSkill = skillRepository.findById(skillDto.getSkillId())
                .orElseThrow(() -> new RuntimeException("Skill not found with id: " + skillDto.getSkillId()));

        List<String> imageUrls = new ArrayList<>();
        if (images != null && images.length > 0) {
            imageUrls = uploadMultipleFiles(images);
        }

        // Merge existing images with new images
        if (skillDto.getImageUrls() != null) {
            imageUrls.addAll(skillDto.getImageUrls());
        }

        existingSkill.setName(skillDto.getName());
        existingSkill.setDescription(skillDto.getDescription());
        existingSkill.setAvailability(skillDto.getAvailability());
        existingSkill.setStartDate(skillDto.getStartDate());
        existingSkill.setEndDate(skillDto.getEndDate());
        existingSkill.setImageUrls(imageUrls);

        skillRepository.save(existingSkill);

        Pricing existingPricing = pricingRepository.findById(pricingDto.getPricingId())
                .orElseThrow(() -> new RuntimeException("Pricing not found with id: " + pricingDto.getPricingId()));

        existingPricing.setPrice(pricingDto.getPrice());
        existingPricing.setPriceType(Pricing.PriceType.valueOf(pricingDto.getPriceType()));

        pricingRepository.save(existingPricing);

        return "Skill updated successfully!";
    }

    @Transactional
    public String deleteSkill(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tool not found"));

        Pricing pricing = pricingRepository.findBySkillId(id)
                .orElseThrow(() -> new RuntimeException("Pricing not found for the skill"));

        if (pricing != null) {
            pricingRepository.delete(pricing);
        }

        skillRepository.delete(skill);
        return "Skill deleted successfully!";
    }

    public List<SkillDto> getAllSkills() {
        List<Skill> skills = skillRepository.findAll();
        return skills.stream()
                .map(skill -> {
                    Pricing pricing = pricingRepository.findBySkillId(skill.getSkillId())
                            .orElseThrow(() -> new RuntimeException("No pricing found for skillId: " + skill.getSkillId()));

                    return SkillDto.builder()
                            .skillId(skill.getSkillId())
                            .userId(skill.getUser().getId())
                            .name(skill.getName())
                            .description(skill.getDescription())
                            .availability(skill.getAvailability())
                            .createdAt(skill.getCreatedAt())
                            .startDate(skill.getStartDate())
                            .endDate(skill.getEndDate())
                            .imageUrls(skill.getImageUrls())
                            .pricingId(pricing.getPricingId())
                            .priceType(pricing.getPriceType())
                            .price(pricing.getPrice())
                            .build();
                })
                .collect(Collectors.toList());


    }

    public SkillDto getSkillBySkillId(String skillId) {
        Skill skill = skillRepository.findById(Long.valueOf(skillId))
                .orElseThrow(() -> new RuntimeException("Skill not found with id: " + skillId));

        Pricing pricing = pricingRepository.findBySkillId(skill.getSkillId())
                .orElseThrow(() -> new RuntimeException("No pricing found for skillId: " + skill.getSkillId()));

        return SkillDto.builder()
                .skillId(skill.getSkillId())
                .userId(skill.getUser().getId())
                .name(skill.getName())
                .description(skill.getDescription())
                .availability(skill.getAvailability())
                .createdAt(skill.getCreatedAt())
                .startDate(skill.getStartDate())
                .endDate(skill.getEndDate())
                .imageUrls(skill.getImageUrls())
                .pricingId(pricing.getPricingId())
                .price(pricing.getPrice())
                .priceType(pricing.getPriceType())
                .build();
    }

    public String restrictSkill(String listingId) {
        Skill skill = skillRepository.findById(Long.valueOf(listingId)).orElseThrow(
                ()->new RuntimeException("The skill not found")
        );
        skill.setAvailability(Skill.Availability.RESTRICT);
        skillRepository.save(skill);
        return "Skill restricted!";
    }

    public String unrestrictedSkill(String listingId) {
        Skill skill = skillRepository.findById(Long.valueOf(listingId)).orElseThrow(
                ()->new RuntimeException("The skill not found")
        );
        skill.setAvailability(Skill.Availability.ACTIVE);
        skillRepository.save(skill);
        return "Skill Unrestricted!";
    }
}
