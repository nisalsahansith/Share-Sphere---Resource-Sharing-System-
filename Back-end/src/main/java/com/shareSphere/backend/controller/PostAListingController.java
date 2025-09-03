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
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/postlisting")
@RequiredArgsConstructor
@CrossOrigin
public class PostAListingController {

    private final SkillService skillService;
    private final ToolService toolService;

    @GetMapping("/skills")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getUserSkills(@RequestParam("userId") String userId) {
        UUID userID = UUID.fromString(userId);
        List<SkillDto> skills = skillService.getToolByUserId(String.valueOf(userID));

        if (skills.isEmpty()) {
            return ResponseEntity.ok(new APIResponse(200, "OK", skills));
        }

        return ResponseEntity.ok(new APIResponse(200, "OK", skills));
    }
    @GetMapping("/tools")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getToolById(@RequestParam("userId") String toolId) {
        UUID userID = UUID.fromString(toolId);
        List<ToolDto> tools = toolService.getToolsByUserId(String.valueOf(userID));

        if (tools.isEmpty()){
            return ResponseEntity.ok(new APIResponse(200,"ok",tools));
        }
        return ResponseEntity.ok(new APIResponse(200, "ok", tools));
    }

    @GetMapping("/get/tool")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getToolByToolId(@RequestParam("toolId") String toolId) {
        System.out.println("Fetching tool with ID: " + toolId);
        ToolDto tool = toolService.findByToolId(toolId);
        ResponseEntity.ok(new APIResponse(200, "ok", tool));

        if (tool == null){
            return ResponseEntity.ok(new APIResponse(200,"ok", null));
        }
        return ResponseEntity.ok(new APIResponse(200, "ok", tool));
    }

    @GetMapping("/get/skill")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getSkillBySkillId(@RequestParam("skillId") String skillId) {
        SkillDto skill = skillService.findBySkillId(skillId);
        ResponseEntity.ok(new APIResponse(200, "ok", skill));

        if (skill == null){
            return ResponseEntity.ok(new APIResponse(200,"ok", null));
        }
        return ResponseEntity.ok(new APIResponse(200, "ok", skill));
    }

    @PostMapping(value = "/updatelisting", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> postASkill(
            @RequestParam("listingId") String listingId,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("availability") String availability,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam("priceType") String priceType,
            @RequestParam("priceId") String priceId,
            @RequestParam("price") Double price,
            @RequestParam("listingType") String listingType,
            @RequestParam(value = "condition", required = false) String condition,
            @RequestParam(value = "country", required = false) String country,
            @RequestParam(value = "state",required = false) String state,
            @RequestParam(value = "existingImages",required = false) List<String> existingImagesUrls,
            @RequestParam(value = "images",required = false) MultipartFile[] images) {
        System.out.println(listingType);
        if ("SKILL".equalsIgnoreCase(listingType)) {
            SkillDto skillDto = new SkillDto();
            skillDto.setSkillId(Long.valueOf(listingId));
            skillDto.setName(name);
            skillDto.setDescription(description);
            skillDto.setAvailability(Skill.Availability.valueOf(availability));
            skillDto.setCreatedAt(LocalDateTime.now());
            skillDto.setImageUrls(existingImagesUrls);
            skillDto.setStartDate(LocalDate.parse(startDate));
            skillDto.setEndDate(LocalDate.parse(endDate));

            PricingDto pricingDto = new PricingDto();
            pricingDto.setPricingId(UUID.fromString(priceId));
            pricingDto.setPriceType(priceType.toUpperCase());
            pricingDto.setPrice(price);
            String message = skillService.updateTheSkill(skillDto, images,pricingDto);
            return ResponseEntity.ok(new APIResponse(200, "ok", message));
        }else if ("TOOL".equalsIgnoreCase(listingType)) {
            ToolDto toolDto = new ToolDto();
            toolDto.setToolId(Long.valueOf(listingId));
            toolDto.setName(name);
            toolDto.setDescription(description);
            toolDto.setAvailabilityStatus(Tool.AvailabilityStatus.valueOf(availability));
            toolDto.setCondition(condition);
            toolDto.setCountry(country);
            toolDto.setState(state);
            toolDto.setImageUrls(existingImagesUrls);
            toolDto.setStartDate(LocalDate.parse(startDate));
            toolDto.setEndDate(LocalDate.parse(endDate));
            toolDto.setCreatedAt(LocalDateTime.now());

            PricingDto pricingDto = new PricingDto();
            pricingDto.setPricingId(UUID.fromString(priceId));
            pricingDto.setPriceType(priceType.toUpperCase());
            pricingDto.setPrice(price);

            String message = toolService.updateTheTool(toolDto, images,pricingDto);
            return ResponseEntity.ok(new APIResponse(200, "ok", message));
        } else {
            return ResponseEntity.badRequest().body(new APIResponse(400, "Bad Request", "Invalid listing type"));
        }
    }

    @DeleteMapping("/delete/skill/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.ok(new APIResponse(200, "ok", "Skill deleted successfully!"));
    }

    @DeleteMapping("/delete/tool/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> deleteTool(@PathVariable Long id) {
        toolService.deleteTool(id);
        return ResponseEntity.ok(new APIResponse(200, "ok", "Tool deleted successfully!"));
    }


}
