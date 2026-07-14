//package com.ismail.demo.StudentServer;
//
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class StudentServer {
//
//    //1. Store the student
//    @PostMapping("/create")
//    public String storeStudent(@RequestBody Student student){
//        int id = student.getId();
//        String name = student.getName();
//        int age = student.getAge();
//        String dept = student.getDept();
//
//        return
//                "Id: "+ id+
//                ", Name: "+ name+
//                ", Age: " + age+
//                ", Dept: "+dept;
//
//    }
//
//    //2. Read the student with id
//    //3. Update student data
//    //4 .Delete the student info
//
//}
