package com.shareSphere.backend.controller;

import com.shareSphere.backend.dto.APIResponse;
import com.shareSphere.backend.service.SkillRequestService;
import com.shareSphere.backend.service.ToolRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/mybookings")
@CrossOrigin
@RequiredArgsConstructor
public class MyRequestController {
    private final SkillRequestService skillRequestService;
    private final ToolRequestService toolRequestService;

    @GetMapping("/getskillsrequests")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getAllSkillRequests(@RequestParam String userId) {
        return ResponseEntity.ok(
                new APIResponse(200, "ok", skillRequestService.getAllSkillRequests(userId))
        );

    }

    @GetMapping("/gettoolsrequests")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getAllToolsRequests(@RequestParam String userId) {
        return ResponseEntity.ok(
                new APIResponse(200, "ok", toolRequestService.getAllToolRequests(userId))
        );

    }
}
