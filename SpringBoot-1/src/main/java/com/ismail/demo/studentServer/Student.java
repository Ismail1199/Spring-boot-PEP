package com.ismail.demo.studentServer;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrimaryKeyJoinColumn;
import org.springframework.context.annotation.Primary;

@Entity
public class Student{

    @Id
    long id;
    String name;
    int age;
    String dept;


}
