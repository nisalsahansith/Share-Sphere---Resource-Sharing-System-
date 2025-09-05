package com.shareSphere.backend.controller;

import com.shareSphere.backend.dto.APIResponse;
import com.shareSphere.backend.dto.SkillRequestDto;
import com.shareSphere.backend.dto.ToolRequestDto;
import com.shareSphere.backend.service.SkillRequestService;
import com.shareSphere.backend.service.ToolRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/browse")
@CrossOrigin
@RequiredArgsConstructor
public class BrowseController {
    private final SkillRequestService skillRequestService;
    private final ToolRequestService toolRequestService;

    @PostMapping("/requestskill")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> makeASkillRequest(@RequestBody SkillRequestDto skillRequestDto) {
        String message = skillRequestService.createSkillRequest(skillRequestDto);
        return ResponseEntity.ok(
                new APIResponse(200, "ok", "Skill request made successfully with ID: " + message)
        );
    }

    @PostMapping("/requesttool")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> makeAToolRequest(@RequestBody ToolRequestDto toolRequestDto) {
        String message = toolRequestService.createToolRequest(toolRequestDto);
        return ResponseEntity.ok(
                new APIResponse(200, "ok", "Skill request made successfully with ID: " + message)
        );
    }
}
