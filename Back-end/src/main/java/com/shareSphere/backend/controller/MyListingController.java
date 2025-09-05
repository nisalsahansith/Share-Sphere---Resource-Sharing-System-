package com.shareSphere.backend.controller;

import com.shareSphere.backend.dto.APIResponse;
import com.shareSphere.backend.dto.ExchangeDto;
import com.shareSphere.backend.dto.SkillDto;
import com.shareSphere.backend.dto.ToolDto;
import com.shareSphere.backend.entity.Exchange;
import com.shareSphere.backend.repositories.UserProfileRepository;
import com.shareSphere.backend.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/mylistings")
@CrossOrigin()
@RequiredArgsConstructor
public class MyListingController {
    private final SkillService skillService;
    private final ToolService toolService;
    private final SkillRequestService skillRequestService;
    private final ToolRequestService toolRequestService;
    private final UserProfileService userProfileService;

    @GetMapping("/getmyskills")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getMySkills(@RequestParam String userId) {
        List<SkillDto> skills = skillService.getSkillByUserId(userId);
        if (skills.isEmpty()) {
            return ResponseEntity.ok(new APIResponse(200, "ok", "Not Found any skills"));
        }
        return ResponseEntity.ok(new APIResponse(200, "ok", skills));
    }

    @GetMapping("/getmytools")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getMyTools(@RequestParam String userId) {
        List<ToolDto> tools = toolService.getToolsByUserId(userId);
        if (tools.isEmpty()) {
            return ResponseEntity.ok(new APIResponse(200, "ok", "Not Found any skills"));
        }
        return ResponseEntity.ok(new APIResponse(200, "ok", tools));
    }

    @GetMapping("/getskillrequests")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getSkillRequests(@RequestParam String skillId) {
        return ResponseEntity.ok(
                new APIResponse(200, "ok", skillRequestService.getSkillRequests(skillId))
        );
    }

    @GetMapping("/gettoolrequests")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getToolRequests(@RequestParam String toolId) {
        return ResponseEntity.ok(
                new APIResponse(200, "ok", toolRequestService.getToolRequests(toolId))
        );
    }

    @GetMapping("/getuserdetails")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getUserDetails(@RequestParam String userId) {
        return ResponseEntity.ok(
                new APIResponse(200, "ok", userProfileService.getUserDetails(userId))
        );
    }

    @PutMapping("/updateskillstatus")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> updateSkillStatus(
            @RequestParam Long skillRequestId,
            @RequestParam String status,
            @RequestParam String type,
            @RequestParam String receiver,
            @RequestParam String giver
            ) {
        ExchangeDto exchangeDto = ExchangeDto.builder()
                .skillRequestId(String.valueOf(skillRequestId))
                .giverId(giver)
                .receiverId(receiver)
                .type(Exchange.Type.valueOf(type.toUpperCase()))
                .build();

        skillRequestService.updateSkillRequestStatus(skillRequestId, status, exchangeDto);
        return ResponseEntity.ok(
                new APIResponse(200, "ok", "Skill request status updated successfully")
        );
    }

    @PutMapping("/updatetoolstatus")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> updateToolStatus(
            @RequestParam Long toolRequestId,
            @RequestParam String status,
            @RequestParam String type,
            @RequestParam String receiver,
            @RequestParam String giver,
            @RequestParam LocalDateTime startTime,
            @RequestParam LocalDateTime endTime) {
        ExchangeDto exchangeDto = ExchangeDto.builder()
                        .toolRequestId(String.valueOf(toolRequestId))
                        .giverId(giver)
                        .receiverId(receiver)
                        .type(Exchange.Type.valueOf(type.toUpperCase()))
                        .startTime(startTime)
                        .endTime(endTime)
                .build();
        toolRequestService.updateToolRequestStatus(toolRequestId, status,exchangeDto);
        return ResponseEntity.ok(
                new APIResponse(200, "ok", "Tool request status updated successfully")
        );
    }


}
