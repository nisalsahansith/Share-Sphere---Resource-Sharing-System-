package com.shareSphere.backend.controller;

import com.shareSphere.backend.dto.APIResponse;
import com.shareSphere.backend.dto.SkillDto;
import com.shareSphere.backend.dto.ToolDto;
import com.shareSphere.backend.dto.UserProfileDto;
import com.shareSphere.backend.service.SkillService;
import com.shareSphere.backend.service.ToolService;
import com.shareSphere.backend.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/getprofile")
@RequiredArgsConstructor
@CrossOrigin
public class ViewProfileController {

    private final SkillService skillService;
    private final ToolService toolService;
    private final UserProfileService userProfileService;

    @GetMapping("/getprofileskills")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getUserSkills(@RequestParam String userId){
        List<SkillDto> list = skillService.getSkillByUserId(userId);
        return ResponseEntity.ok(new APIResponse(
                200,
                "OK",
                list
        ));
    }

    @GetMapping("/getprofiletools")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getUserTools(@RequestParam String userId){
        List<ToolDto> list = toolService.getToolsByUserId(userId);
        return ResponseEntity.ok(new APIResponse(
                200,
                "OK",
                list
        ));
    }

    @GetMapping("/getprofildetails")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getUserDetails(@RequestParam String userId){

        return ResponseEntity.ok(new APIResponse(
                200,
                "OK",
                userProfileService.getUserDetails(userId)
        ));
    }

    @PutMapping("/updateprofile")
    public ResponseEntity<APIResponse> updateProfile(
            @RequestParam String userId,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("mobile") String mobile,
            @RequestParam("address") String address,
            @RequestParam(value = "userImage", required = false) MultipartFile userImage,
            @RequestParam(value = "currentPassword", required = false) String currentPassword,
            @RequestParam(value = "newPassword", required = false) String newPassword
    ) {
        return ResponseEntity.ok(new APIResponse(200,"Ok",
        userProfileService.uploadUserDetails(userId,firstName,lastName,mobile,address,currentPassword,newPassword,userImage)));

    }
}
