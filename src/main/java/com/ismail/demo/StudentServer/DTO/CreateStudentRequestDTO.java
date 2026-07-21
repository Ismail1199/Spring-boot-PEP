package com.ismail.demo.StudentServer.DTO;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateStudentRequestDTO {
    private String name;
    private int age;
    private String department;
    private String email;

}