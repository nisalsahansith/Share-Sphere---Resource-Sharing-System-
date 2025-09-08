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
@RequestMapping("/myworks")
@RequiredArgsConstructor
@CrossOrigin
public class MyWorksController {
    private final ExchangeService exchangeService;

    @GetMapping("/getmyworks")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> getMyWorks(@RequestParam String userId){
        List<ExchangeDto> exchanges = exchangeService.getExchangeByGiverId(userId);
        return ResponseEntity.ok(new APIResponse(
                200,
                "OK"
                ,exchanges
        ));
    }

    @PutMapping("/updatestatus")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> updateStatus(@RequestParam String status,@RequestParam String exchangeId){
        return ResponseEntity.ok(new APIResponse(
                200,
                "OK",
                exchangeService.updateExchangeStatus(exchangeId,status.toUpperCase())));
    }
}
