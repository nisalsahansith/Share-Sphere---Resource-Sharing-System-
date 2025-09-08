package com.shareSphere.backend.repositories;

import com.shareSphere.backend.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByExchangeIdOrderByTimestampAsc(Long exchangeId);

    List<ChatMessage> findBySenderId(String senderId);

    ChatMessage findFirstByReceiverIdAndSenderIdOrderByTimestampDesc(String receiverId, String senderId);

    List<ChatMessage> findAllBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderByTimestampAsc(
            String senderId1, String receiverId1,
            String senderId2, String receiverId2
    );

    List<ChatMessage> findAllBySenderIdOrReceiverId(String currentUserId, String currentUserId1);
}
