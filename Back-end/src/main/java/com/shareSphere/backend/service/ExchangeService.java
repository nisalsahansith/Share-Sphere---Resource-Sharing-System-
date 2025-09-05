package com.shareSphere.backend.service;

import com.shareSphere.backend.dto.ExchangeDto;
import com.shareSphere.backend.dto.SkillRequestDto;
import com.shareSphere.backend.dto.ToolRequestDto;
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
                            .type(exchange.getType());

                    // Only set SkillRequest info if it exists
                    if (exchange.getSkillRequest() != null) {
                        builder.skillRequestId(String.valueOf(exchange.getSkillRequest().getSkillRequestId()));
                    }

                    // Only set ToolRequest info if it exists
                    if (exchange.getToolRequest() != null) {
                        builder.toolRequestId(String.valueOf(exchange.getToolRequest().getToolRequestId()));
                    }

                    return builder.build();
                })
                .collect(Collectors.toList());

    }

}
