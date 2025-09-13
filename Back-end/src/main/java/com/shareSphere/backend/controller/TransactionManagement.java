package com.shareSphere.backend.controller;

import com.shareSphere.backend.dto.APIResponse;
import com.shareSphere.backend.dto.PayOutDto;
import com.shareSphere.backend.dto.RefundDto;
import com.shareSphere.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/transaction")
@CrossOrigin
@RequiredArgsConstructor
public class TransactionManagement {
    private final PaymentService paymentService;

    @GetMapping("/getall")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse> getPayments(){
        return ResponseEntity.ok(
                new APIResponse(200,"OK",paymentService.getAll())
        );
    }

    @PostMapping("/payout")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse> makePayout(@RequestBody PayOutDto payOutDto){
        String message = paymentService.makePayout(payOutDto);
        return ResponseEntity.ok(new APIResponse(
                200,"OK",message
        ));
    }

    @PostMapping("/refund")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse> makeRefund(@RequestBody RefundDto refundDto){
        String message = paymentService.makeRefund(refundDto);
        return ResponseEntity.ok(new APIResponse(
                200,"OK",message
        ));
    }


}
