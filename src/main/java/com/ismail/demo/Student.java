package com.ismail.demo;

import org.springframework.stereotype.Component;

@Component
public class Student {

    private String name;
    private int ID;
    private int age;

    public Student(){

    }

    public Student(String name, int  ID, int age){
        this.name = name;
        this.age = age;
        this.ID = ID;
    }

    public void setName(String name) {
        this.name = name;
    }
    public void setID(int ID) {
        this.ID = ID;
    }
    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }
    public int getID() {
        return ID;
    }
    public int getAge() {
        return age;
    }

}
