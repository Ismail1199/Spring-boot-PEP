package com.ismail.demo.StudentServer.Service;

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

    public Student studentValidate(Student student){
        int id = student.getId();
        String name = student.getName();
        int age = student.getAge();
        String dept = student.getDept();

        if(id<0 || name==null || age<0 || dept==null || name.isBlank() || dept.isBlank()) {
            return null;
        }

        student.setCreatedAt(LocalDateTime.now());
        student.setUpdatedAt(LocalDateTime.now());

        studentRepository.save(student);
        return student;
    }

    public Student getStudentById(int id){
        return studentRepository.findById(id).orElse(null);
    }

    public Student updateStudentById(int id, Student student){
        Student existing = studentRepository.findById(id).orElse(null);

        if(existing == null){
            return null;
        }

        existing.setName(student.getName());
        existing.setAge(student.getAge());
        existing.setDept(student.getDept());
        existing.setUpdatedAt(LocalDateTime.now());
        return studentRepository.save(existing);
    }

    public boolean deleteStudentById(int id){
        Student existing = studentRepository.findById(id).orElse(null);

        if(existing == null){
            return false;
        }

        studentRepository.delete(existing);
        return true;
    }
}
