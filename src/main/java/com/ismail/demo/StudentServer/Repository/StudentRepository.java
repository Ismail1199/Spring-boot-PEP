package com.ismail.demo.StudentServer.Repository;

import com.ismail.demo.StudentServer.Entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

//@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {

}