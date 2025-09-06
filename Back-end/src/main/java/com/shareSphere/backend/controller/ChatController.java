package com.shareSphere.backend.controller;

import com.shareSphere.backend.dto.ChatMessageDto;
import com.shareSphere.backend.entity.ChatMessage;
import com.shareSphere.backend.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessageDto message) {
        ChatMessage saved = chatService.sendMessage(
                message.getExchangeId(),
                message.getSenderId(),
                message.getReceiverId(),
                message.getContent()
        );
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ChatMessage>> getMessages(@RequestParam Long exchangeId) {
        List<ChatMessage> messages = chatService.getMessages(exchangeId);
        return ResponseEntity.ok(messages);
    }
}
