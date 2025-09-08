package com.shareSphere.backend.service;

import com.shareSphere.backend.dto.ExchangeDto;
import com.shareSphere.backend.dto.SkillDto;
import com.shareSphere.backend.dto.SkillRequestDto;
import com.shareSphere.backend.entity.*;
import com.shareSphere.backend.repositories.ExchangeRepository;
import com.shareSphere.backend.repositories.SkillRepository;
import com.shareSphere.backend.repositories.SkillRequestRepository;
import com.shareSphere.backend.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillRequestService {
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final SkillRequestRepository skillRequestRepository;
    private final ExchangeRepository exchangeRepository;

    public String createSkillRequest(SkillRequestDto skillRequestDto) {
        User user = userRepository.findById(skillRequestDto.getRequesterId()).orElseThrow(
                () -> new RuntimeException("User not found")
        );

        Skill skill = skillRepository.findById(Long.parseLong(skillRequestDto.getSkillId())).orElseThrow(
                () -> new RuntimeException("Skill not found")
        );

        SkillRequest skillRequest = SkillRequest.builder()
                .requester(user)
                .skill(skill)
                .status(SkillRequest.Status.PENDING)
                .totalPrice(skillRequestDto.getPrice())
                .requestedDate(skillRequestDto.getRequestedDates())
                .message(skillRequestDto.getMessage())
                .build();

        skillRequestRepository.save(skillRequest);
        return "Skill request created ";
    }

    public List<SkillRequestDto> getAllSkillRequests(String userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("User not found")
        );
        List<SkillRequest> skillRequests = skillRequestRepository.findSkillRequestByRequester(user);

        return skillRequests.stream().map(skillRequest -> SkillRequestDto.builder()
                        .skillRequestId(skillRequest.getSkillRequestId())
                        .requesterId(skillRequest.getRequester().getId())
                        .skillId(String.valueOf(skillRequest.getSkill().getSkillId()))
                        .status(skillRequest.getStatus())
                        .requestedDates(skillRequest.getRequestedDate())
                        .message(skillRequest.getMessage())
                        .price(skillRequest.getTotalPrice() )
                        .skillDto(skillRequest.getSkill() != null ? SkillDto.builder()
                                .skillId(skillRequest.getSkill().getSkillId())
                                .userId(skillRequest.getSkill().getUser().getId())
                                .name(skillRequest.getSkill().getName())
                                .description(skillRequest.getSkill().getDescription())
                                .availability(skillRequest.getSkill().getAvailability())
                                .createdAt(skillRequest.getSkill().getCreatedAt())
                                .startDate(skillRequest.getSkill().getStartDate())
                                .endDate(skillRequest.getSkill().getEndDate())
                                .imageUrls(skillRequest.getSkill().getImageUrls())
                                .build() : null)
                        .build())
                .toList();
    }

    public List<SkillRequestDto> getSkillRequests(String skillId) {
        Skill skill = skillRepository.findById(Long.parseLong(skillId)).orElseThrow(
                () -> new RuntimeException("Skill not found")
        );
        List<SkillRequest> skillRequests = skillRequestRepository.findSkillRequestBySkill(skill);
        return skillRequests.stream().map(skillRequest -> SkillRequestDto.builder()
                        .skillRequestId(skillRequest.getSkillRequestId())
                        .requesterId(skillRequest.getRequester().getId())
                        .skillId(String.valueOf(skillRequest.getSkill().getSkillId()))
                        .status(skillRequest.getStatus())
                        .requestedDates(skillRequest.getRequestedDate())
                        .message(skillRequest.getMessage())
                        .price(skillRequest.getTotalPrice() )
                        .skillDto(skillRequest.getSkill() != null ? SkillDto.builder()
                                .skillId(skillRequest.getSkill().getSkillId())
                                .userId(skillRequest.getSkill().getUser().getId())
                                .name(skillRequest.getSkill().getName())
                                .description(skillRequest.getSkill().getDescription())
                                .availability(skillRequest.getSkill().getAvailability())
                                .createdAt(skillRequest.getSkill().getCreatedAt())
                                .startDate(skillRequest.getSkill().getStartDate())
                                .endDate(skillRequest.getSkill().getEndDate())
                                .imageUrls(skillRequest.getSkill().getImageUrls())
                                .build() : null)
                        .build())
                .toList();
    }

    @Transactional
    public void updateSkillRequestStatus(Long skillRequestId, String status, ExchangeDto exchangeDto) {
        SkillRequest skillRequest = skillRequestRepository.findById(skillRequestId).orElseThrow(
                () -> new RuntimeException("Skill request not found")
        );
        SkillRequest.Status newStatus;
        try {
            newStatus = SkillRequest.Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value");
        }
        skillRequest.setStatus(newStatus);
        skillRequestRepository.save(skillRequest);

        if (status.equalsIgnoreCase("Accepted")) {
            SkillRequest skillRequests = skillRequestRepository.findById(Long.valueOf(exchangeDto.getSkillRequestId()))
                    .orElseThrow(() -> new RuntimeException("Tool Request Not Found"));
            User giver = userRepository.findById(exchangeDto.getGiverId())
                    .orElseThrow(() -> new RuntimeException("Giver not found"));
            User receiver = userRepository.findById(exchangeDto.getReceiverId())
                    .orElseThrow(() -> new RuntimeException("Receiver not found"));

            Exchange exchange = Exchange.builder()
                    .skillRequest(skillRequests)
                    .giver(giver)
                    .receiver(receiver)
                    .type(exchangeDto.getType())
                    .build();

            exchangeRepository.save(exchange);
        }

    }
}
