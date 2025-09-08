package com.shareSphere.backend.controller;

import com.shareSphere.backend.dto.APIResponse;
import com.shareSphere.backend.dto.ChatMessageDto;
import com.shareSphere.backend.dto.ChatSummaryDto;
import com.shareSphere.backend.entity.ChatMessage;
import com.shareSphere.backend.service.ChatService;
import com.shareSphere.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@CrossOrigin
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;

    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessageDto message) {
        ChatMessage saved = chatService.sendTextMessage(
                message.getExchangeId(),
                message.getSenderId(),
                message.getReceiverId(),
                message.getContent()
        );
        return ResponseEntity.ok(saved);
    }

    // Upload + send file
    @PostMapping("/send-file")
    public ResponseEntity<ChatMessage> sendFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("senderId") String senderId,
            @RequestParam("receiverId") String receiverId,
            @RequestParam("exchangeId") Long exchangeId
    ) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get("uploads/" + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());

        String fileUrl = "/uploads/" + fileName;

        ChatMessage saved = chatService.sendFileMessage(exchangeId, senderId, receiverId, fileUrl, file.getContentType());
        return ResponseEntity.ok(saved);
    }

    // Get chat history
    @GetMapping("/messages")
    public ResponseEntity<List<ChatMessage>> getMessages(@RequestParam Long exchangeId) {
        List<ChatMessage> messages = chatService.getMessages(exchangeId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/getusername")
    public ResponseEntity<APIResponse> getUserName(@RequestParam String userId){
        return ResponseEntity.ok(new APIResponse(200,"OK",userService.getUserName(UUID.fromString(userId))));
    }

    @GetMapping("/chat/list")
    public ResponseEntity<?> getChatList(@RequestParam String userId) {
        List<ChatSummaryDto> chats = chatService.getChatList(UUID.fromString(userId));
        return ResponseEntity.ok(new APIResponse(200, "OK", chats));
    }

    @GetMapping("/chat/conversation")
    public ResponseEntity<?> getConversation(
            @RequestParam String senderId1,
            @RequestParam String receiverId1,
            @RequestParam String senderId2,
            @RequestParam String receiverId2) {
        List<ChatMessageDto> messages = chatService.getConversation(senderId1,receiverId1,senderId2,receiverId2);
        return ResponseEntity.ok(new APIResponse(200, "OK", messages));
    }

}
