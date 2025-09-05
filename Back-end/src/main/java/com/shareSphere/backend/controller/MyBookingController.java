package com.shareSphere.backend.controller;

import com.shareSphere.backend.dto.APIResponse;
import com.shareSphere.backend.dto.ExchangeDto;
import com.shareSphere.backend.service.ExchangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mybookings")
@CrossOrigin
@RequiredArgsConstructor
public class MyBookingController {

    private final ExchangeService exchangeService;

    @GetMapping("/getmybookings")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getMyBookings(@RequestParam String userId){
        List<ExchangeDto> exchanges = exchangeService.getExchangeByUserId(userId);
        return ResponseEntity.ok(new APIResponse(
                200,
                "OK"
                ,exchanges
        ));
    }
}
