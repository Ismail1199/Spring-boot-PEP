package com.ismail.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		ApplicationContext context = SpringApplication.run(DemoApplication.class, args);
		Student student = context.getBean(Student.class);
		student.setName("Ismail");
		student.setAge(21);
		student.setID(1231);

		System.out.println(student.getName());
		System.out.println(student.getAge());
		System.out.println(student.getID());
	}

}