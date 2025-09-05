package com.shareSphere.backend.repositories;

import com.shareSphere.backend.entity.Tool;
import com.shareSphere.backend.entity.ToolRequest;
import com.shareSphere.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ToolRequestRepository extends JpaRepository<ToolRequest, Long> {
    List<ToolRequest> findToolRequestByTool(Tool tool);

    List<ToolRequest> findToolRequestByRequester(User user);
}
