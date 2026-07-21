package com.ismail.demo.StudentServer.DTO;

import lombok.AllArgsConstructor;
import  lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Locale;

@Data
@AllArgsConstructor
public class ExceptionResponseDTO {
    private LocalDateTime timestamp;
    private int statusCode;
    private String error;
    private String message;
    private String path;
}
