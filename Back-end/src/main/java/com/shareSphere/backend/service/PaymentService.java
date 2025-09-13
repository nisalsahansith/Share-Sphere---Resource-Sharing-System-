package com.shareSphere.backend.service;

import com.shareSphere.backend.dto.PayOutDto;
import com.shareSphere.backend.dto.PaymentDto;
import com.shareSphere.backend.dto.RefundDto;
import com.shareSphere.backend.entity.*;
import com.shareSphere.backend.repositories.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final ExchangeRepository exchangeRepository;
    private final PayOutRepository payOutRepository;
    private final RefundRepository refundRepository;

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

    public List<PaymentDto> getAll() {
        List<Payment> payments = paymentRepository.findAll();
        List<PaymentDto> paymentDTO = new ArrayList<>();
        for (Payment payment: payments){
            PaymentDto paymentDto = PaymentDto.builder()
                    .paymentId(payment.getPaymentId())
                    .amount(payment.getAmount())
                    .paymentDate(payment.getPaymentDate())
                    .paymentMethod(payment.getPaymentMethod())
                    .paymentStatus(payment.getPaymentStatus())
                    .transactionId(payment.getTransactionId())
                    .exchangeId(payment.getExchange().getExchangeId().toString())
                    .payerId(payment.getPayer().getId())
                    .receiverId(payment.getReceiver().getId())
                    .build();
            paymentDTO.add(paymentDto);
        }
        return paymentDTO;
    }

    @Transactional
    public String makePayout(PayOutDto payOutDto) {
        Exchange exchange = exchangeRepository.findById(Long.valueOf(payOutDto.getExchange())).orElseThrow(()->new RuntimeException("Exchange not found"));
        Payment payment = paymentRepository.findById(exchange.getPayment().getPaymentId()).orElseThrow(()->new RuntimeException("Payment not Found"));
        payment.setPaymentStatus(Payment.PaymentStatus.RELEASED);
        paymentRepository.save(payment);

        User user = userRepository.findById(payOutDto.getReceiverId()).orElseThrow(()->new RuntimeException("User not Found"));
        BigDecimal amount = payOutDto.getAmount();
        double newCommission = (Double.parseDouble(String.valueOf(amount))/ 100) * 1;
        double total = (Double.parseDouble(String.valueOf(amount)) -newCommission);
        Payout payout = Payout.builder()
                .receiverId(user)
                .amount(payOutDto.getAmount())
                .commission(BigDecimal.valueOf(newCommission))
                .totalAmount(BigDecimal.valueOf(total))
                .status(payOutDto.getStatus())
                .exchange(exchange)
                .build();

        payOutRepository.save(payout);
        return "SuccessFully Payment Released!";
    }

    @Transactional
    public String makeRefund(RefundDto refundDto) {
        Exchange exchange = exchangeRepository.findById(refundDto.getExchange().getExchangeId()).orElseThrow(()->new RuntimeException("Exchange not found"));
        Payment payment = paymentRepository.findById(exchange.getPayment().getPaymentId()).orElseThrow(()->new RuntimeException("Payment not Found"));
        payment.setPaymentStatus(Payment.PaymentStatus.REFUNDED);
        paymentRepository.save(payment);

        User user = userRepository.findById(String.valueOf(refundDto.getReceiverId())).orElseThrow(()->new RuntimeException("User not Found"));

        Refund refund = Refund.builder()
                .receiverId(user)
                .amount(refundDto.getAmount())
                .status(Refund.RefundStatus.APPROVED)
                .exchange(exchange)
                .build();

        refundRepository.save(refund);
        return "SuccessFully Refunded!";
    }
}
