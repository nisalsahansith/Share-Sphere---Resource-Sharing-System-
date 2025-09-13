package com.shareSphere.backend.service;

import com.shareSphere.backend.util.HashUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

@Service
public class PayHereService {

    @Value("${payhere.merchant.id}")
    private String merchantId;

    @Value("${payhere.merchant.secret}")
    private String merchantSecret;

    public String generatePaymentHash(String orderId, String amount, String currency) throws NoSuchAlgorithmException {
        // PayHere requires amount to have 2 decimal places
        String formattedAmount = String.format("%.2f", Double.parseDouble(amount));
        String rawData = orderId + merchantId + formattedAmount + currency +merchantSecret;

        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] digest = md.digest(rawData.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : digest) {
            sb.append(String.format("%02x", b));
        }
        String hash = sb.toString().toUpperCase();

        return hash;

//        String hashedSecret = HashUtil.md5(merchantSecret);
//        String raw = merchantId + orderId + formattedAmount + currency + hashedSecret;
//
//        return HashUtil.md5(raw);
    }
}
