package com.shareSphere.backend.controller;

import com.shareSphere.backend.dto.APIResponse;
import com.shareSphere.backend.dto.PricingDto;
import com.shareSphere.backend.dto.SkillDto;
import com.shareSphere.backend.dto.ToolDto;
import com.shareSphere.backend.entity.Skill;
import com.shareSphere.backend.entity.Tool;
import com.shareSphere.backend.service.SkillService;
import com.shareSphere.backend.service.ToolService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@CrossOrigin
public class UserDashboardController {
    private final SkillService skillService;
    private final ToolService toolService;

    @PostMapping("/createlisting")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> postASkill(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("availability") String availability,
            @RequestParam("userId") String userId,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("priceType") String priceType,
            @RequestParam("price") Double price,
            @RequestParam("listingType") String listingType,
            @RequestParam("condition") String condition,
            @RequestParam("country") String country,
            @RequestParam("state") String state,
            @RequestParam("images") MultipartFile[] images) {
        if ("SKILL".equalsIgnoreCase(listingType)) {
            SkillDto skillDto = new SkillDto();
            skillDto.setName(name);
            skillDto.setDescription(description);
            skillDto.setAvailability(Skill.Availability.valueOf(availability));
            skillDto.setUserId(userId);
            skillDto.setCreatedAt(LocalDateTime.now());
            skillDto.setStartDate(LocalDate.parse(startDate));
            skillDto.setEndDate(LocalDate.parse(endDate));

            PricingDto pricingDto = new PricingDto();
            pricingDto.setPriceType(priceType.toUpperCase());
            pricingDto.setPrice(price);
            String message = skillService.postASkill(skillDto, images,pricingDto);
            return ResponseEntity.ok(new APIResponse(200, "ok", message));
        }else if ("TOOL".equalsIgnoreCase(listingType)) {
            ToolDto toolDto = new ToolDto();
            toolDto.setName(name);
            toolDto.setDescription(description);
            toolDto.setAvailabilityStatus(Tool.AvailabilityStatus.valueOf(availability));
            toolDto.setUserId(userId);
            toolDto.setCondition(condition);
            toolDto.setCountry(country);
            toolDto.setState(state);
            toolDto.setStartDate(LocalDate.parse(startDate));
            toolDto.setEndDate(LocalDate.parse(endDate));
            toolDto.setCreatedAt(LocalDateTime.now());

            PricingDto pricingDto = new PricingDto();
            pricingDto.setPriceType(priceType.toUpperCase());
            pricingDto.setPrice(price);

            String message = toolService.postATool(toolDto, images,pricingDto);
            return ResponseEntity.ok(new APIResponse(200, "ok", message));
        } else {
            return ResponseEntity.badRequest().body(new APIResponse(400, "Bad Request", "Invalid listing type"));
        }
    }

}
