package com.ismail.demo.StudentServer.Controller;

import com.ismail.demo.StudentServer.DTO.ChangePasswordDTO;
import com.ismail.demo.StudentServer.DTO.RequestStudentDTO;
import com.ismail.demo.StudentServer.DTO.ResponseStudentDTO;
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
    public ResponseEntity<ResponseStudentDTO> storeStudent(@RequestBody Student student){
        ResponseStudentDTO result = studentService.studentValidate(student);
        if(result==null){
            return ResponseEntity.status(400).body(result);
        }
        return ResponseEntity.status(201).body(result);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable int id){
        ResponseStudentDTO student = studentService.getStudentById(id);
        if(student==null){
            return ResponseEntity.status(404).body("Student not found");
        }
        return ResponseEntity.status(200).body(student);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateStudentById(@PathVariable int id, @RequestBody RequestStudentDTO dto){
        ResponseStudentDTO updatedStudent = studentService.updateStudent(id, dto);

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

    @PutMapping("/change-password/{id}")
    public ResponseEntity<?> changePassword(@PathVariable int id, @RequestBody ChangePasswordDTO dto) {
        boolean passwordChanged = studentService.changePassword(id, dto);
        if(!passwordChanged){
            return ResponseEntity.status(404).body("student not found or incorrect password");
        }
        return ResponseEntity.status(200).body("Password changed successfully");
    }

}
