package com.shareSphere.backend.service;

import com.shareSphere.backend.dto.ChatMessageDto;
import com.shareSphere.backend.dto.ChatSummaryDto;
import com.shareSphere.backend.entity.ChatMessage;
import com.shareSphere.backend.entity.User;
import com.shareSphere.backend.repositories.ChatMessageRepository;
import com.shareSphere.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository repository;
    private final UserRepository userRepository;

    public ChatMessage sendTextMessage(Long exchangeId, String senderId, String receiverId, String content) {
        ChatMessage message = new ChatMessage();
        message.setExchangeId(exchangeId);
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        return repository.save(message);
    }

    public ChatMessage sendFileMessage(Long exchangeId, String senderId, String receiverId, String fileUrl, String fileType) {
        ChatMessage message = new ChatMessage();
        message.setExchangeId(exchangeId);
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setFileUrl(fileUrl);
        message.setFileType(fileType);
        message.setTimestamp(LocalDateTime.now());
        return repository.save(message);
    }

    public List<ChatMessage> getMessages(Long exchangeId) {
        return repository.findByExchangeIdOrderByTimestampAsc(exchangeId);
    }

    public List<ChatSummaryDto> getChatList(UUID userId) {
        String currentUserId = String.valueOf(userId);

        // 🔹 1. Fetch all messages where user is sender or receiver
        List<ChatMessage> chatMessages = repository.findAllBySenderIdOrReceiverId(currentUserId, currentUserId);

        // 🔹 2. Group by "conversation partner" (the other user)
        Map<String, ChatMessage> latestMessageMap = new HashMap<>();

        for (ChatMessage msg : chatMessages) {
            String otherUserId = msg.getSenderId().equals(currentUserId)
                    ? msg.getReceiverId()
                    : msg.getSenderId();

            // keep only the latest message for this partner
            ChatMessage existing = latestMessageMap.get(otherUserId);
            if (existing == null || msg.getTimestamp().isAfter(existing.getTimestamp())) {
                latestMessageMap.put(otherUserId, msg);
            }
        }

        // 🔹 3. Build DTO list
        List<ChatSummaryDto> chatSummaries = new ArrayList<>();

        for (Map.Entry<String, ChatMessage> entry : latestMessageMap.entrySet()) {
            String otherUserId = entry.getKey();
            ChatMessage lastMsg = entry.getValue();

            User otherUser = userRepository.findById(otherUserId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + otherUserId));

            ChatSummaryDto dto = ChatSummaryDto.builder()
                    .userId(UUID.fromString(otherUser.getId()))
                    .username(otherUser.getUsername())
                    .exchangeId(String.valueOf(lastMsg.getExchangeId()))
                    .lastMessage(lastMsg.getContent())
                    .lastMessageTime(String.valueOf(lastMsg.getTimestamp()))
                    .build();

            chatSummaries.add(dto);
        }

        // 🔹 4. Sort by latest message time (descending)
        chatSummaries.sort((a, b) -> b.getLastMessageTime().compareTo(a.getLastMessageTime()));

        return chatSummaries;
    }

    public List<ChatMessageDto> getConversation(String senderId1,String receiverId1,String senderId2, String receiverId2) {
        List<ChatMessage> chatMessages = repository.findAllBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderByTimestampAsc(senderId1,receiverId1,senderId2,receiverId2);
        List<ChatMessageDto> chatMessagesDto = new ArrayList<>();
        for (ChatMessage chatMessage: chatMessages){
            System.out.println(chatMessage.getContent());
            ChatMessageDto chatMessageDto = ChatMessageDto.builder()
                    .senderId(chatMessage.getSenderId())
                    .receiverId(chatMessage.getReceiverId())
                    .content(chatMessage.getContent())
                    .timestamp(chatMessage.getTimestamp())
                    .build();
            chatMessagesDto.add(chatMessageDto);
        }
        return chatMessagesDto;
    }
}
