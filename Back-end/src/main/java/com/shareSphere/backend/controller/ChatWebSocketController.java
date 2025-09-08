package com.shareSphere.backend.controller;

import com.shareSphere.backend.dto.ChatMessageDto;
import com.shareSphere.backend.entity.ChatMessage;
import com.shareSphere.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;



    @MessageMapping("/chat.send")
    @SendTo("/topic/messages")
    public ChatMessage sendMessage(ChatMessageDto message) {
        ChatMessage saved;

        if (message.getContent() != null) {
            saved = chatService.sendTextMessage(
                    message.getExchangeId(),
                    message.getSenderId(),
                    message.getReceiverId(),
                    message.getContent()
            );
        } else {
            saved = chatService.sendFileMessage(
                    message.getExchangeId(),
                    message.getSenderId(),
                    message.getReceiverId(),
                    message.getFileUrl(),
                    message.getFileType()
            );
        }

        return saved;
    }
}
