package com.shareSphere.backend.service;

import com.shareSphere.backend.dto.PaymentDto;
import com.shareSphere.backend.entity.Exchange;
import com.shareSphere.backend.entity.Payment;
import com.shareSphere.backend.entity.User;
import com.shareSphere.backend.repositories.ExchangeRepository;
import com.shareSphere.backend.repositories.PaymentRepository;
import com.shareSphere.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final ExchangeRepository exchangeRepository;

    public String paymentSave(PaymentDto paymentDto) {
        User receiver = userRepository.findById(paymentDto.getReceiverId()).orElseThrow(
                ()-> new RuntimeException("User not found")
        );

        User payer = userRepository.findById(paymentDto.getPayerId()).orElseThrow(
                ()-> new RuntimeException("User not found")
        );

        Exchange exchange = exchangeRepository.findById(Long.valueOf(paymentDto.getExchangeId())).orElseThrow(
                () -> new RuntimeException("Exchange not found")
        );

        exchange.setStatus(Exchange.Status.PAYED);

        Payment payment = Payment.builder()
                .amount(paymentDto.getAmount())
                .paymentDate(paymentDto.getPaymentDate())
                .paymentStatus(paymentDto.getPaymentStatus())
                .payer(payer)
                .receiver(receiver)
                .transactionId(paymentDto.getTransactionId())
                .exchange(exchange)
                .transactionId(paymentDto.getTransactionId())
                .build();
        paymentRepository.save(payment);
        exchangeRepository.save(exchange);
        return "Payment Done successfully";
    }
}
