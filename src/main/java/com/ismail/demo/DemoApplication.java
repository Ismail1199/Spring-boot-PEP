package com.ismail.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {

		SpringApplication.run(DemoApplication.class, args);

		Student student1 = new Student("Ismail", 1231, 21);
		System.out.println(student1.getName());
		System.out.println(student1.getAge());
		System.out.println(student1.getID());
	}

}