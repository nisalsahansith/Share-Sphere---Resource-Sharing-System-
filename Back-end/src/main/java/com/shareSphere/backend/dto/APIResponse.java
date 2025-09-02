package com.shareSphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class APIResponse {
    private int code;
    private String status;
    private Object data;
     
}
