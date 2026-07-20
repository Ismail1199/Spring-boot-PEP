package com.ismail.demo.StudentServer.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ResponseStudentDTO {

    private int id;
    private String name;
    private int age;
    private String dept;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}