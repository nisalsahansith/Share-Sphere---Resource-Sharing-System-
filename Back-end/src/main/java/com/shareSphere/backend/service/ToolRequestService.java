package com.shareSphere.backend.service;

import com.shareSphere.backend.dto.ExchangeDto;
import com.shareSphere.backend.dto.ToolDto;
import com.shareSphere.backend.dto.ToolRequestDto;
import com.shareSphere.backend.entity.Exchange;
import com.shareSphere.backend.entity.Tool;
import com.shareSphere.backend.entity.ToolRequest;
import com.shareSphere.backend.entity.User;
import com.shareSphere.backend.repositories.ExchangeRepository;
import com.shareSphere.backend.repositories.ToolRepository;
import com.shareSphere.backend.repositories.ToolRequestRepository;
import com.shareSphere.backend.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ToolRequestService {
    private final ToolRequestRepository toolRequestRepository;
    private final UserRepository userRepository;
    private final ToolRepository toolRepository;
    private final ExchangeRepository exchangeRepository;

    public String createToolRequest(ToolRequestDto toolRequestDto) {
        User user = userRepository.findById(toolRequestDto.getRequesterId()).orElseThrow(
                () -> new RuntimeException("User not found")
        );

        Tool tool = toolRepository.findById(Long.parseLong(toolRequestDto.getToolId())).orElseThrow(
                () -> new RuntimeException("Tool not found")
        );

        ToolRequest toolRequest = ToolRequest.builder()
                .requester(user)
                .tool(tool)
                .status(ToolRequest.Status.PENDING)
                .borrowStartDate(toolRequestDto.getBorrowStartDate())
                .borrowEndDate(toolRequestDto.getBorrowEndDate())
                .totalPrice(toolRequestDto.getPrice())
                .message(toolRequestDto.getMessage())
                .build();
        toolRequestRepository.save(toolRequest);
        return "Tool request created ";
    }

    public List<LocalDate> getBookedDays(String toolId) {
        Tool tool = toolRepository.findById(Long.parseLong(toolId))
                .orElseThrow(() -> new RuntimeException("Tool not found"));
        List<ToolRequest> toolRequests = toolRequestRepository.findToolRequestByTool(tool);

        List<LocalDate> bookedDays = new ArrayList<>();

        for (ToolRequest request : toolRequests) {
            LocalDate startDate = request.getBorrowStartDate().toLocalDate();
            LocalDate endDate = request.getBorrowEndDate().toLocalDate();

            // Generate all dates between start and end (inclusive)
            LocalDate current = startDate;
            while (!current.isAfter(endDate)) {
                bookedDays.add(current);
                current = current.plusDays(1);
            }
        }

        // Optional: remove duplicates if needed
        bookedDays = bookedDays.stream().distinct().collect(Collectors.toList());

        return bookedDays;
    }

    public List<ToolRequestDto> getAllToolRequests(String userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("User not found")
        );
        List<ToolRequest> toolRequests = toolRequestRepository.findToolRequestByRequester(user);

        return toolRequests.stream().map(toolRequest -> ToolRequestDto.builder()
                        .toolRequestId(toolRequest.getToolRequestId())
                        .requesterId(toolRequest.getRequester().getId())
                        .toolId(String.valueOf(toolRequest.getTool().getToolId()))
                        .status(toolRequest.getStatus())
                        .borrowStartDate(toolRequest.getBorrowStartDate())
                        .borrowEndDate(toolRequest.getBorrowEndDate())
                        .message(toolRequest.getMessage())
                        .price(toolRequest.getTotalPrice())
                        .toolDto(toolRequest.getTool() != null ? ToolDto.builder()
                                .toolId(toolRequest.getTool().getToolId())
                                .userId(toolRequest.getTool().getUser().getId())
                                .name(toolRequest.getTool().getName())
                                .description(toolRequest.getTool().getDescription())
                                .availabilityStatus(toolRequest.getTool().getAvailabilityStatus())
                                .condition(toolRequest.getTool().getCondition())
                                .country(toolRequest.getTool().getCountry())
                                .state(toolRequest.getTool().getState())
                                .createdAt(toolRequest.getTool().getCreatedAt())
                                .startDate(toolRequest.getTool().getStartDate())
                                .endDate(toolRequest.getTool().getEndDate())
                                .imageUrls(toolRequest.getTool().getImageUrls())
                                .build() : null)
                        .build())
                .toList();
    }

    public Object getToolRequests(String toolId) {
        Tool tool = toolRepository.findById(Long.parseLong(toolId)).orElseThrow(
                () -> new RuntimeException("Tool not found")
        );
        List<ToolRequest> toolRequests = toolRequestRepository.findToolRequestByTool(tool);
        return toolRequests.stream().map(toolRequest -> ToolRequestDto.builder()
                        .toolRequestId(toolRequest.getToolRequestId())
                        .requesterId(toolRequest.getRequester().getId())
                        .toolId(String.valueOf(toolRequest.getTool().getToolId()))
                        .status(toolRequest.getStatus())
                        .borrowStartDate(toolRequest.getBorrowStartDate())
                        .borrowEndDate(toolRequest.getBorrowEndDate())
                        .message(toolRequest.getMessage())
                        .price(toolRequest.getTotalPrice())
                        .toolDto(toolRequest.getTool() != null ? ToolDto.builder()
                                .toolId(toolRequest.getTool().getToolId())
                                .userId(toolRequest.getTool().getUser().getId())
                                .name(toolRequest.getTool().getName())
                                .description(toolRequest.getTool().getDescription())
                                .availabilityStatus(toolRequest.getTool().getAvailabilityStatus())
                                .condition(toolRequest.getTool().getCondition())
                                .country(toolRequest.getTool().getCountry())
                                .state(toolRequest.getTool().getState())
                                .createdAt(toolRequest.getTool().getCreatedAt())
                                .startDate(toolRequest.getTool().getStartDate())
                                .endDate(toolRequest.getTool().getEndDate())
                                .imageUrls(toolRequest.getTool().getImageUrls())
                                .build() : null)
                        .build())
                .toList();
    }

    @Transactional
    public void updateToolRequestStatus(Long toolRequestId, String status, ExchangeDto exchangeDto) {
        ToolRequest toolRequest = toolRequestRepository.findById(toolRequestId).orElseThrow(
                () -> new RuntimeException("Tool request not found")
        );
        ToolRequest.Status newStatus;
        try {
            newStatus = ToolRequest.Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value");
        }
        toolRequest.setStatus(newStatus);
        toolRequestRepository.save(toolRequest);
        if (status.equalsIgnoreCase("Accepted")) {
            ToolRequest tool = toolRequestRepository.findById(Long.valueOf(exchangeDto.getToolRequestId()))
                    .orElseThrow(() -> new RuntimeException("Tool Request Not Found"));
            User giver = userRepository.findById(exchangeDto.getGiverId())
                    .orElseThrow(() -> new RuntimeException("Giver not found"));
            User receiver = userRepository.findById(exchangeDto.getReceiverId())
                    .orElseThrow(() -> new RuntimeException("Receiver not found"));

            Exchange exchange = Exchange.builder()
                    .toolRequest(tool)
                    .giver(giver)
                    .receiver(receiver)
                    .type(exchangeDto.getType())
                    .startTime(exchangeDto.getStartTime())
                    .endTime(exchangeDto.getEndTime())
                    .build();

            exchangeRepository.save(exchange);
        }
    }
}
