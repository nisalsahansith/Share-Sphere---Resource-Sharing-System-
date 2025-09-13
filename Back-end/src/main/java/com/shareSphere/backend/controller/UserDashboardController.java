package com.shareSphere.backend.controller;

import com.shareSphere.backend.dto.APIResponse;
import com.shareSphere.backend.dto.SkillDto;
import com.shareSphere.backend.dto.ToolDto;
import com.shareSphere.backend.service.SkillService;
import com.shareSphere.backend.service.ToolRequestService;
import com.shareSphere.backend.service.ToolService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@CrossOrigin
public class UserDashboardController {
    private final SkillService skillService;
    private final ToolService toolService;
    private final ToolRequestService toolRequestService;

    @GetMapping("/getallskills")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getAllSkills() {
        List<SkillDto> skills = skillService.getAllSkills();
        if (skills.isEmpty()) {
            return ResponseEntity.ok(new APIResponse(200, "ok", "No skills found"));
        }
        return ResponseEntity.ok(new APIResponse(200, "ok", skills));
    }

    @GetMapping("/getalltools")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getAllTools() {
        List<ToolDto> tools = toolService.getAllTools();
        if (tools.isEmpty()) {
            return ResponseEntity.ok(new APIResponse(200, "ok", "No skills found"));
        }
        return ResponseEntity.ok(new APIResponse(200, "ok", tools));
    }

    @GetMapping("/getaskill")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getASkill(@RequestParam String skillId) {
        SkillDto skills = skillService.getSkillBySkillId(skillId);
        if (skills == null) {
            return ResponseEntity.ok(new APIResponse(200, "ok", "No skills found"));
        }
        return ResponseEntity.ok(new APIResponse(200, "ok", skills));
    }

    @GetMapping("/getatool")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getATool(@RequestParam String toolId) {
        ToolDto tools = toolService.getToolByToolId(toolId);
        if (tools == null) {
            return ResponseEntity.ok(new APIResponse(200, "ok", "No skills found"));
        }
        return ResponseEntity.ok(new APIResponse(200, "ok", tools));
    }

    @GetMapping("/gettoolbookeddays")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getToolBookedDays(@RequestParam String toolId) {
        List<LocalDate> bookedDays = toolRequestService.getBookedDays(toolId);
        return ResponseEntity.ok(new APIResponse(200, "ok", bookedDays));
    }

}
