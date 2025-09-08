package com.shareSphere.backend.service;

import com.shareSphere.backend.dto.*;
import com.shareSphere.backend.entity.Exchange;
import com.shareSphere.backend.repositories.ExchangeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExchangeService {
    private final ExchangeRepository exchangeRepository;

    public List<ExchangeDto> getExchangeByUserId(String userId) {
        List<Exchange> exchanges = exchangeRepository.findByReceiverId(userId);

        return exchanges.stream()
                .map(exchange -> {
                    ExchangeDto.ExchangeDtoBuilder builder = ExchangeDto.builder()
                            .exchangeId(exchange.getExchangeId())
                            .giverId(exchange.getGiver().getId())
                            .receiverId(exchange.getReceiver().getId())
                            .startTime(exchange.getStartTime())
                            .endTime(exchange.getEndTime())
                            .type(exchange.getType())
                            .status(String.valueOf(exchange.getStatus()))
                            .paymentId(
                                    exchange.getPayment() != null
                                            ? exchange.getPayment().getPaymentId().toString()
                                            : null
                            );

                    // Map SkillRequest
                    if (exchange.getSkillRequest() != null) {
                        builder.skillRequestDto(
                                SkillRequestDto.builder()
                                        .skillRequestId(exchange.getSkillRequest().getSkillRequestId())
                                        .message(exchange.getSkillRequest().getMessage())
                                        .price(exchange.getSkillRequest().getTotalPrice())
                                        .skillDto(
                                                SkillDto.builder()
                                                        .name(exchange.getSkillRequest().getSkill().getName())
                                                        .description(exchange.getSkillRequest().getSkill().getDescription())
                                                        .imageUrls(exchange.getSkillRequest().getSkill().getImageUrls())
                                                        .build()
                                        )
                                        .build()
                        );
                    }

                    // Map ToolRequest
                    if (exchange.getToolRequest() != null) {
                        builder.toolRequestDto(
                                ToolRequestDto.builder()
                                        .toolRequestId(exchange.getToolRequest().getToolRequestId())
                                        .message(exchange.getToolRequest().getMessage())
                                        .price(exchange.getToolRequest().getTotalPrice())
                                        .toolDto(
                                                ToolDto.builder()
                                                        .name(exchange.getToolRequest().getTool().getName())
                                                        .description(exchange.getToolRequest().getTool().getDescription())
                                                        .condition(exchange.getToolRequest().getTool().getCondition())
                                                        .country(exchange.getToolRequest().getTool().getCountry())
                                                        .state(exchange.getToolRequest().getTool().getState())
                                                        .imageUrls(exchange.getToolRequest().getTool().getImageUrls())
                                                        .build()
                                        )
                                        .build()
                        );
                    }

                    return builder.build();
                })
                .collect(Collectors.toList());
    }


    public List<ExchangeDto> getExchangeByGiverId(String userId) {
        List<Exchange> exchanges = exchangeRepository.findByGiverId(userId);

        return exchanges.stream()
                .map(exchange -> {
                    ExchangeDto.ExchangeDtoBuilder builder = ExchangeDto.builder()
                            .exchangeId(exchange.getExchangeId())
                            .giverId(exchange.getGiver().getId())
                            .receiverId(exchange.getReceiver().getId())
                            .startTime(exchange.getStartTime())
                            .endTime(exchange.getEndTime())
                            .type(exchange.getType())
                            .status(String.valueOf(exchange.getStatus()))
                            .paymentId(
                                    exchange.getPayment() != null
                                            ? exchange.getPayment().getPaymentId().toString()
                                            : null
                            );


                    // Map SkillRequest
                    if (exchange.getSkillRequest() != null) {
                        builder.skillRequestDto(
                                SkillRequestDto.builder()
                                        .skillRequestId(exchange.getSkillRequest().getSkillRequestId())
                                        .message(exchange.getSkillRequest().getMessage())
                                        .price(exchange.getSkillRequest().getTotalPrice())
                                        .skillDto(
                                                SkillDto.builder()
                                                        .name(exchange.getSkillRequest().getSkill().getName())
                                                        .description(exchange.getSkillRequest().getSkill().getDescription())
                                                        .imageUrls(exchange.getSkillRequest().getSkill().getImageUrls())
                                                        .build()
                                        )
                                        .build()
                        );
                    }

                    // Map ToolRequest
                    if (exchange.getToolRequest() != null) {
                        builder.toolRequestDto(
                                ToolRequestDto.builder()
                                        .toolRequestId(exchange.getToolRequest().getToolRequestId())
                                        .message(exchange.getToolRequest().getMessage())
                                        .price(exchange.getToolRequest().getTotalPrice())
                                        .toolDto(
                                                ToolDto.builder()
                                                        .name(exchange.getToolRequest().getTool().getName())
                                                        .description(exchange.getToolRequest().getTool().getDescription())
                                                        .condition(exchange.getToolRequest().getTool().getCondition())
                                                        .country(exchange.getToolRequest().getTool().getCountry())
                                                        .state(exchange.getToolRequest().getTool().getState())
                                                        .imageUrls(exchange.getToolRequest().getTool().getImageUrls())
                                                        .build()
                                        )
                                        .build()
                        );
                    }

                    return builder.build();
                })
                .collect(Collectors.toList());
    }

    public String updateExchangeStatus(String exchangeId, String status) {
        Exchange exchange = exchangeRepository.findById(Long.valueOf(exchangeId)).orElseThrow(
                ()-> new RuntimeException("Exchange not found")
        );
        exchange.setStatus(Exchange.Status.valueOf(status));
        exchangeRepository.save(exchange);
        return "Status update successful";
    }
}
