package com.ismail.demo.myPortfolio;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyPortfolio {
    @GetMapping("skills")
    public String mySkills(){
        return """
                <h1>Skills</h1>
                    <ul>
                        <li>Java</li>
                        <li>Spring Boot</li>
                        <li>Python</li>
                        <li>SQL</li>
                        <li>HTML & CSS</li>
                        <li>Git & GitHub</li>
                        <li>Docker</li>
                        <li>Machine Learning</li>
                    </ul>
                """;
    }

    @GetMapping("/projects")
    public String myProjects(){
        return """
                <h1>Projects</h1>
                    <ol>
                        <li>House Price Prediction using Machine Learning</li>
                        <li>Garbage Collection Visualizer</li>
                        <li>Spring Boot REST APIs</li>
                    </ol>
                """;
    }

    @GetMapping("/education")
    public String myEducation(){
        return """
                <h1>Education</h1>
                    <ul>
                        <li>B.Tech CSE  - LPU</li>
                        <li>12th        - GVHSS Kadirur</li>
                        <li>10th        - RGMHSS Mokeri</li>
                    </ul>
                """;
    }


    @GetMapping("/mySelf")
    public String MySelf(){
        return """
                    <h1>Hi, I'm Ismail K</h1>

                    <p>
                        I am a 3rd Year B.Tech Computer Science Engineering student
                        passionate about Java, Spring Boot, Machine Learning, and DevOps.
                    </p>

                    <h2>Profiles</h2>
                    <ul>
                        <li>
                            GitHub:
                            <a href="https://github.com/your-github-username" target="_blank">
                                github.com/your-github-username
                            </a>
                        </li>

                        <li>
                            LeetCode:
                            <a href="https://leetcode.com/your-username" target="_blank">
                                leetcode.com/your-username
                            </a>
                        </li>

                        <li>
                            LinkedIn:
                            <a href="https://linkedin.com/in/your-profile" target="_blank">
                                linkedin.com/in/your-profile
                            </a>
                        </li>
                    </ul>
                    <h2>Contact</h2>
                    <p><b>Email:</b> your-email@example.com</p>
                """;
    }
}