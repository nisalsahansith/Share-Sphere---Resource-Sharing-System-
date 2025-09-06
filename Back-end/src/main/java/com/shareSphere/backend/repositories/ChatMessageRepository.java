package com.shareSphere.backend.repositories;

import com.shareSphere.backend.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByExchangeIdOrderByTimestampAsc(Long exchangeId);
}
