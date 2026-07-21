package com.ismail.demo.StudentServer.Service;

import com.ismail.demo.StudentServer.DTO.CreateStudentRequestDTO;
import com.ismail.demo.StudentServer.DTO.CreateStudentResponseDTO;
import com.ismail.demo.StudentServer.Entity.Student;
import com.ismail.demo.StudentServer.Repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class StudentService {
    StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public CreateStudentResponseDTO studentValidate(CreateStudentRequestDTO createStudentRequestDTO) {

        Student student = mapToStudent(createStudentRequestDTO);
        studentRepository.save(student);
        return mapToResponseDTO(student);
    }

    public Student getStudentById(int id) throws Exception {
        return studentRepository.findById(id).orElseThrow(()->new Exception());
    }

    public Student studentUpdate(int id, Student student) {

        Student result = studentRepository.findById(id).orElse(null);

        if (result == null) {
            return null;
        }

        result.setName(student.getName());
        result.setAge(student.getAge());
        result.setDepartment(student.getDepartment());
        result.setUpdatedAt(LocalDateTime.now());
        result.setEmail(student.getEmail());

        return studentRepository.save(result);
    }

    public Student deleteStudent(int id) {
        Student result = studentRepository.findById(id).orElse(null);
        if(result == null) {
            return null;
        }
        studentRepository.delete(result);
        return result;
    }

    private Student mapToStudent(CreateStudentRequestDTO createStudentRequestDTO) {
        Student student = new Student();

        student.setName(createStudentRequestDTO.getName());
        student.setAge(createStudentRequestDTO.getAge());
        student.setDepartment(createStudentRequestDTO.getDepartment());
        student.setCreatedAt(LocalDateTime.now());
        student.setUpdatedAt(LocalDateTime.now());
        student.setEmail(createStudentRequestDTO.getEmail());

        return student;
    }

    private CreateStudentResponseDTO mapToResponseDTO(Student student) {
        CreateStudentResponseDTO createStudentResponseDTO = new CreateStudentResponseDTO();
        createStudentResponseDTO.setId(student.getId());
        createStudentResponseDTO.setName(student.getName());
        createStudentResponseDTO.setAge(student.getAge());
        createStudentResponseDTO.setDepartment(student.getDepartment());
        createStudentResponseDTO.setEmail(student.getEmail());

        return createStudentResponseDTO;

    }
}
