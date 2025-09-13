package com.shareSphere.backend.controller;

import com.shareSphere.backend.service.PayHereService;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final PayHereService payHereService;

    public PaymentController(PayHereService payHereService) {
        this.payHereService = payHereService;
    }

    @GetMapping("/generate-hash")
    public Map<String, String> generateHash(
            @RequestParam String orderId,
            @RequestParam String amount,
            @RequestParam String currency) {

        String hash = null;
        try {
            hash = payHereService.generatePaymentHash(orderId, amount, currency);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }

        Map<String, String> response = new HashMap<>();
        response.put("hash", hash);
        return response;
    }
}
