package com.ismail.demo.StudentServer.Controller;

import com.ismail.demo.StudentServer.DTO.CreateStudentRequestDTO;
import com.ismail.demo.StudentServer.DTO.CreateStudentResponseDTO;
import com.ismail.demo.StudentServer.Entity.Student;
import com.ismail.demo.StudentServer.Service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class StudentController {

    StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> storeStudent(@Valid @RequestBody CreateStudentRequestDTO createStudentRequestDTO) {
        CreateStudentResponseDTO result = studentService.studentValidate(createStudentRequestDTO);

        if(result == null)
        {
            return ResponseEntity.status(400).body("Invalid input");
        }
        return  ResponseEntity.status(201).body(result);
    }

    @GetMapping("/getStudent/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable int id) {

        Student student = studentService.getStudentById(id);

        if(student == null){
            return ResponseEntity.status(404).body("Student not found");
        }

        return ResponseEntity.ok(student);
    }

    @PutMapping("/updateStudent/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable int id, @Valid @RequestBody Student student){
        Student result = studentService.studentUpdate(id, student);
        if(result == null)
        {
            return ResponseEntity.status(400).body("Invalid input");
        }
        return ResponseEntity.status(200).body(result);
    }

    @DeleteMapping("/deleteStudent/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable int id){
        Student student = studentService.deleteStudent(id);
        if(student == null) {
            return ResponseEntity.status(400).body("Invalid input");
        }
        return ResponseEntity.status(200).body("Student deleted");
    }
}