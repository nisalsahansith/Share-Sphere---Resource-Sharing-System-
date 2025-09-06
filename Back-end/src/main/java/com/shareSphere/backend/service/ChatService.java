package com.shareSphere.backend.service;

import com.shareSphere.backend.entity.ChatMessage;
import com.shareSphere.backend.repositories.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository repository;


    public ChatMessage sendMessage(Long exchangeId, String senderId, String receiverId, String content) {
        ChatMessage message = new ChatMessage();
        message.setExchangeId(exchangeId);
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        return repository.save(message);
    }

    public List<ChatMessage> getMessages(Long exchangeId) {
        return repository.findByExchangeIdOrderByTimestampAsc(exchangeId);
    }
}
