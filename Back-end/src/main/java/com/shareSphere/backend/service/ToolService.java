package com.shareSphere.backend.service;

import com.shareSphere.backend.dto.PricingDto;
import com.shareSphere.backend.dto.SkillDto;
import com.shareSphere.backend.dto.ToolDto;
import com.shareSphere.backend.entity.Pricing;
import com.shareSphere.backend.entity.Skill;
import com.shareSphere.backend.entity.Tool;
import com.shareSphere.backend.entity.User;
import com.shareSphere.backend.repositories.PricingRepository;
import com.shareSphere.backend.repositories.ToolRepository;
import com.shareSphere.backend.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ToolService {
    private final ToolRepository toolRepository;
    private final UserRepository userRepository;
    private final PricingRepository pricingRepository;
    private final CloudService cloudService;

    @Transactional
    public String postATool(ToolDto toolDto, MultipartFile[] images, PricingDto pricingDto) {
        List<String> imageUrls = uploadMultipleFiles(images);

        User user = userRepository.findById(toolDto.getUserId()).orElseThrow(
                ()-> new RuntimeException("User not found")
        );
        Tool tool = Tool.builder()
                .toolId(toolDto.getToolId())
                .user(user)
                .name(toolDto.getName())
                .description(toolDto.getDescription())
                .condition(toolDto.getCondition())
                .country(toolDto.getCountry())
                .state(toolDto.getState())
                .endDate(toolDto.getEndDate())
                .startDate(toolDto.getStartDate())
                .availabilityStatus(toolDto.getAvailabilityStatus())
                .createdAt(toolDto.getCreatedAt())
                .imageUrls(imageUrls)
                .build();
        toolRepository.save(tool);

        Pricing pricing = Pricing.builder()
                .priceType(Pricing.PriceType.valueOf(pricingDto.getPriceType()))
                .price(pricingDto.getPrice())
                .tool(tool) // Associate pricing with the newly created skill
                .owner(user) // Assuming the owner is the same as the user posting the skill
                .build();
        pricingRepository.save(pricing);
        return "Tool saved successfully";
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

    public List<ToolDto> getToolsByUserId(String userId) {
        List<Tool> tools = toolRepository.findByUserId(userId);
        return tools.stream().map(tool -> ToolDto.builder()
                .toolId(tool.getToolId())
                .userId(tool.getUser().getId())
                .name(tool.getName())
                .description(tool.getDescription())
                .availabilityStatus(tool.getAvailabilityStatus())
                .createdAt(tool.getCreatedAt())
                .startDate(tool.getStartDate())
                .endDate(tool.getEndDate())
                .imageUrls(tool.getImageUrls())
                .condition(tool.getCondition())
                .country(tool.getCountry())
                .state(tool.getState())
                .build()
        ).collect(Collectors.toList());
    }

    public ToolDto findByToolId(String toolId) {
        Pricing pricing = pricingRepository.findByToolId(Long.valueOf(toolId))
                .orElseThrow(() -> new RuntimeException("No pricing found for toolId: " + toolId));

        Tool tool = pricing.getTool();

        return ToolDto.builder()
                .toolId(tool.getToolId())
                .userId(tool.getUser().getId())
                .name(tool.getName())
                .description(tool.getDescription())
                .condition(tool.getCondition())
                .availabilityStatus(tool.getAvailabilityStatus())
                .country(tool.getCountry())
                .state(tool.getState())
                .startDate(tool.getStartDate())
                .endDate(tool.getEndDate())
                .imageUrls(tool.getImageUrls())
                .createdAt(tool.getCreatedAt())
                .pricingId(pricing.getPricingId())
                .price(pricing.getPrice())
                .priceType(pricing.getPriceType())
                .build();
    }

    public String updateTheTool(ToolDto toolDto, MultipartFile[] images, PricingDto pricingDto) {
        Tool existingTool = toolRepository.findById(toolDto.getToolId())
                .orElseThrow(() -> new RuntimeException("Skill not found with id: " + toolDto.getToolId()));

        List<String> imageUrls = new ArrayList<>();
        if (images != null && images.length > 0) {
            imageUrls = uploadMultipleFiles(images);
        }

        // Merge existing images with new images
        if (toolDto.getImageUrls() != null) {
            imageUrls.addAll(toolDto.getImageUrls());
        }

        existingTool.setName(toolDto.getName());
        existingTool.setDescription(toolDto.getDescription());
        existingTool.setAvailabilityStatus(toolDto.getAvailabilityStatus());
        existingTool.setStartDate(toolDto.getStartDate());
        existingTool.setEndDate(toolDto.getEndDate());
        existingTool.setCondition(toolDto.getCondition());
        existingTool.setCountry(toolDto.getCountry());
        existingTool.setState(toolDto.getState());
        existingTool.setImageUrls(imageUrls);

        toolRepository.save(existingTool);

        Pricing existingPricing = pricingRepository.findById(pricingDto.getPricingId())
                .orElseThrow(() -> new RuntimeException("Pricing not found with id: " + pricingDto.getPricingId()));

        existingPricing.setPrice(pricingDto.getPrice());
        existingPricing.setPriceType(Pricing.PriceType.valueOf(pricingDto.getPriceType()));

        pricingRepository.save(existingPricing);

        return "Tool updated successfully!";

    }

    @Transactional
    public String deleteTool(Long id) {
        Tool tool = toolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tool not found"));

        Pricing pricing = pricingRepository.findByToolId(tool.getToolId())
                .orElseThrow(() -> new RuntimeException("Pricing not found for the tool"));
        if (pricing != null) {
            pricingRepository.delete(pricing);
        }

        toolRepository.delete(tool);
        return "Tool deleted successfully!";
    }

    public List<ToolDto> getAllSkills() {
        List<Tool> tools = toolRepository.findAll();
        return tools.stream()
                .map(tool -> {
                    Pricing pricing = pricingRepository.findByToolId(tool.getToolId())
                            .orElseThrow(() -> new RuntimeException("No pricing found for skillId: " + tool.getToolId()));

                    return ToolDto.builder()
                            .toolId(tool.getToolId())
                            .userId(tool.getUser().getId())
                            .name(tool.getName())
                            .description(tool.getDescription())
                            .availabilityStatus(tool.getAvailabilityStatus())
                            .createdAt(tool.getCreatedAt())
                            .startDate(tool.getStartDate())
                            .endDate(tool.getEndDate())
                            .imageUrls(tool.getImageUrls())
                            .condition(tool.getCondition())
                            .country(tool.getCountry())
                            .state(tool.getState())
                            .pricingId(pricing.getPricingId())
                            .priceType(pricing.getPriceType())
                            .price(pricing.getPrice())
                            .build();
                })
                .collect(Collectors.toList());

    }

    public ToolDto getToolByToolId(String toolId) {
        Tool tool = toolRepository.findById(Long.valueOf(toolId))
                .orElseThrow(() -> new RuntimeException("Tool not found with id: " + toolId));

        Pricing pricing = pricingRepository.findByToolId(tool.getToolId())
                .orElseThrow(() -> new RuntimeException("No pricing found for toolId: " + toolId));

        return ToolDto.builder()
                .toolId(tool.getToolId())
                .userId(tool.getUser().getId())
                .name(tool.getName())
                .description(tool.getDescription())
                .availabilityStatus(tool.getAvailabilityStatus())
                .createdAt(tool.getCreatedAt())
                .startDate(tool.getStartDate())
                .endDate(tool.getEndDate())
                .imageUrls(tool.getImageUrls())
                .condition(tool.getCondition())
                .country(tool.getCountry())
                .state(tool.getState())
                .pricingId(pricing.getPricingId())
                .priceType(pricing.getPriceType())
                .price(pricing.getPrice())
                .build();
    }
}
