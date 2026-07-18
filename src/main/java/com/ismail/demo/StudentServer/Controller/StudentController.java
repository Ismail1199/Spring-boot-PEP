package com.ismail.demo.StudentServer.Controller;

import com.ismail.demo.StudentServer.Entity.Student;
import com.ismail.demo.StudentServer.Service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")

public class StudentController {

    StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService){
        this.studentService = studentService;
    }

    @PostMapping("/create")
    public ResponseEntity<Student> storeStudent(@RequestBody Student student){
        Student result = studentService.studentValidate(student);
        if(result==null){
            return ResponseEntity.status(400).body(result);
        }
        return ResponseEntity.status(201).body(result);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable int id){
        Student student = studentService.getStudentById(id);
        return ResponseEntity.status(200).body(student);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateStudentById(@PathVariable int id, @RequestBody Student student){
        Student updatedStudent = studentService.updateStudentById(id, student);

        if(updatedStudent == null){
            return ResponseEntity.status(404).body("student not found");
        }

        return ResponseEntity.status(200).body(updatedStudent);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteStudentById(@PathVariable int id){
        boolean deleted = studentService.deleteStudentById(id);

        if(!deleted){
            return ResponseEntity.status(404).body("Student not found");
        }

        return ResponseEntity.status(200).body("Student deleted successfully");
    }

}
