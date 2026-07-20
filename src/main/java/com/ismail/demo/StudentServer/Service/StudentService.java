package com.ismail.demo.StudentServer.Service;

import com.ismail.demo.StudentServer.DTO.ChangePasswordDTO;
import com.ismail.demo.StudentServer.DTO.RequestStudentDTO;
import com.ismail.demo.StudentServer.DTO.ResponseStudentDTO;
import com.ismail.demo.StudentServer.Repository.StudentRepository;
import com.ismail.demo.StudentServer.Entity.Student;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class StudentService {

    StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository){
        this.studentRepository = studentRepository;
    }

    public ResponseStudentDTO studentValidate(Student student){
        int id = student.getId();
        String name = student.getName();
        int age = student.getAge();
        String dept = student.getDept();
        String password = student.getPassword();

        if(name==null || age<=0 || dept==null || name.isBlank() || dept.isBlank() || password==null || password.isBlank()) {
            return null;
        }

        student.setCreatedAt(LocalDateTime.now());
        student.setUpdatedAt(LocalDateTime.now());

        studentRepository.save(student);
        return convertToDTO(student);
    }

    public ResponseStudentDTO getStudentById(int id) {
        Student student = studentRepository.findById(id).orElse(null);

        if(student == null)
            return null;

        return convertToDTO(student);
    }

    public boolean deleteStudentById(int id){
        Student existing = studentRepository.findById(id).orElse(null);

        if(existing == null){
            return false;
        }

        studentRepository.delete(existing);
        return true;
    }

    public ResponseStudentDTO updateStudent(int id, RequestStudentDTO dto) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setName(dto.getName());
        student.setAge(dto.getAge());
        student.setUpdatedAt(LocalDateTime.now());

        studentRepository.save(student);

        return convertToDTO(student);
    }

    public boolean changePassword(int id, ChangePasswordDTO dto) {
        Student student = studentRepository.findById(id).orElse(null);
        if (student == null)
            return false;

        if (!student.getPassword().equals(dto.getOldPassword()))
            return false;

        if (dto.getNewPassword() == null || dto.getNewPassword().isBlank()) {
            return false;
        }
        student.setPassword(dto.getNewPassword());
        student.setUpdatedAt(LocalDateTime.now());

        studentRepository.save(student);

        return true;
    }

    private ResponseStudentDTO convertToDTO(Student student) {

        ResponseStudentDTO dto = new ResponseStudentDTO();

        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setAge(student.getAge());
        dto.setDept(student.getDept());

        dto.setCreatedAt(student.getCreatedAt());
        dto.setUpdatedAt(student.getUpdatedAt());

        return dto;
    }

}
