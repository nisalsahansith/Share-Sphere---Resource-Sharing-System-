package com.shareSphere.backend.controller;

import com.shareSphere.backend.dto.APIResponse;
import com.shareSphere.backend.dto.ExchangeDto;
import com.shareSphere.backend.dto.PaymentDto;
import com.shareSphere.backend.entity.Payment;
import com.shareSphere.backend.service.ExchangeService;
import com.shareSphere.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/mybookings")
@CrossOrigin
@RequiredArgsConstructor
public class MyBookingController {

    private final ExchangeService exchangeService;
    private final PaymentService paymentService;

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

    @PostMapping("/paymentdone")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<APIResponse> paymentDone(
            @RequestBody PaymentDto paymentDto
//            @RequestParam String ExchangeId,
//            @RequestParam String amount,
//            @RequestParam String paymentDate,
//            @RequestParam String paymentMethod,
//            @RequestParam String paymentStatus,
//            @RequestParam String transactionId,
//            @RequestParam String payerId,
//            @RequestParam String receiverId
            ){
//        PaymentDto paymentDto = PaymentDto.builder()
//                .exchangeId(ExchangeId)
//                .paymentDate(LocalDateTime.parse(paymentDate))
//                .amount(Double.parseDouble(amount))
//                .paymentMethod(Payment.PaymentMethod.valueOf(paymentMethod))
//                .paymentStatus(Payment.PaymentStatus.valueOf(paymentStatus))
//                .transactionId(transactionId)
//                .payerId(payerId)
//                .receiverId(receiverId)
//                .build();
        return ResponseEntity.ok(new APIResponse(
                200,
                "OK",
                paymentService.paymentSave(paymentDto)));
    }
}
