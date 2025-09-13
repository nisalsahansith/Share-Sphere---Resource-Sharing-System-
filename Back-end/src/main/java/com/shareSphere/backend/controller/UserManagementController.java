package com.shareSphere.backend.controller;

import com.shareSphere.backend.dto.APIResponse;
import com.shareSphere.backend.dto.UserProfileDto;
import com.shareSphere.backend.service.UserProfileService;
import com.shareSphere.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/usercontroller")
@RequiredArgsConstructor
@CrossOrigin
public class UserManagementController {

    private final UserProfileService userProfileService;
    private final UserService userService;

    @GetMapping("/getusers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse> getAllUser(){
        List<UserProfileDto> userDetails = userProfileService.getAllUserDetail();
        return ResponseEntity.ok(
                new APIResponse(200,"OK",userDetails)
        );
    }

    @PatchMapping("/userblock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse> blockUser(@RequestParam String userId){
        return ResponseEntity.ok(new APIResponse(
                200,
                "OK"
                ,userService.blockUser(userId)));
    }

    @PatchMapping("/userunblock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse> unblockUser(@RequestParam String userId){
        return ResponseEntity.ok(new APIResponse(
                200,
                "OK"
                ,userService.unblockUser(userId)));
    }

    @DeleteMapping("/userdeleet")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse> userDelete(@RequestParam String userId){
        return ResponseEntity.ok(new APIResponse(
                200,
                "OK"
                ,userService.userDelete(userId)));
    }
}
