package com.shareSphere.backend.repositories;

import com.shareSphere.backend.entity.Exchange;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExchangeRepository extends JpaRepository<Exchange,Long> {
    List<Exchange> findByReceiverId(String userId);
}
