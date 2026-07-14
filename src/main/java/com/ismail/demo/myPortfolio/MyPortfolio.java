package com.ismail.demo.myPortfolio;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyPortfolio {
    @GetMapping("/mySelf")
    public String MySelf(){
        return """
                 <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>My Portfolio</title>
                </head>
                <body>

                    <h1>Hi, I'm Ismail K</h1>

                    <p>
                        I am a 3rd Year B.Tech Computer Science Engineering student
                        passionate about Java, Spring Boot, Machine Learning, and DevOps.
                    </p>

                    <hr>

                    <h2>Education</h2>
                    <table border="1" cellpadding="8">
                        <tr>
                            <th>Qualification</th>
                            <th>Institution</th>
                            <th>Year</th>
                        </tr>
                        <tr>
                            <td>B.Tech Computer Science Engineering</td>
                            <td>Your College Name</td>
                            <td>2024 - 2028</td>
                        </tr>
                        <tr>
                            <td>Higher Secondary (12th)</td>
                            <td>Your School Name</td>
                            <td>2024</td>
                        </tr>
                        <tr>
                            <td>Secondary School (10th)</td>
                            <td>Your School Name</td>
                            <td>2022</td>
                        </tr>
                    </table>

                    <hr>

                    <h2>Skills</h2>
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

                    <hr>

                    <h2>Projects</h2>
                    <ol>
                        <li>House Price Prediction using Machine Learning</li>
                        <li>Garbage Collection Visualizer</li>
                        <li>Spring Boot REST APIs</li>
                    </ol>

                    <hr>

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

                    <hr>

                    <h2>Contact</h2>
                    <p><b>Email:</b> your-email@example.com</p>

                </body>
                </html>
                """;
    }
}