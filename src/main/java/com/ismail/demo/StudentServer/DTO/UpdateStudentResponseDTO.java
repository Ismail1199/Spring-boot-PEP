package com.ismail.demo.StudentServer.DTO;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdateStudentResponseDTO {

    private int id;
    private String name;
    private int age;
    private String department;

}
