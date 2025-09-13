package com.shareSphere.backend.controller;

import com.shareSphere.backend.dto.APIResponse;
import com.shareSphere.backend.dto.SkillDto;
import com.shareSphere.backend.dto.ToolDto;
import com.shareSphere.backend.service.SkillService;
import com.shareSphere.backend.service.ToolService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/listings")
@CrossOrigin
@RequiredArgsConstructor
public class ListingManagementController {

    private final SkillService skillService;
    private final ToolService toolService;

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse> getAllListings() {
        // Fetch data separately
        List<SkillDto> skills = skillService.getAllSkills();
        List<ToolDto> tools = toolService.getAllTools();
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "OK",
                        List.of(skills,tools)
                )
        );

    }
    
    @PutMapping("/restriclisting")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse> restrictListing(@RequestParam String listingId, @RequestParam String type){
        String message = "";
        if (type.equalsIgnoreCase("skill")){
            message = skillService.restrictSkill(listingId);
        }else if (type.equalsIgnoreCase("tool")){
            message = toolService.restrictTool(listingId);
        }
        return ResponseEntity.ok(new APIResponse(200,"OK",message));
    }

    @PutMapping("/unrestriclisting")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse> unrestrictedListing(@RequestParam String listingId, @RequestParam String type){
        String message = "";
        if (type.equalsIgnoreCase("skill")){
            message = skillService.unrestrictedSkill(listingId);
        }else if (type.equalsIgnoreCase("tool")){
            message = toolService.unrestrictedTool(listingId);
        }
        return ResponseEntity.ok(new APIResponse(200,"OK",message));
    }
}

