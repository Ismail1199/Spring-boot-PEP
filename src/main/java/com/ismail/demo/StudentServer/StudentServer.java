package com.ismail.demo.StudentServer;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StudentServer {

    //1. Store the student
    @PostMapping("/create")
    public String storeStudent(){
        return """
                id : 1
                name : Ismail
                Dept : CSE
                Age : 22
       
                """;
    }

    //2. Read the student with id
    //3. Update student data
    //4 .Delete the student info

}
