package com.LocalServices.LocalService.controller;

import com.LocalServices.LocalService.model.User;
import com.LocalServices.LocalService.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {

    @Autowired
    private UserService userService;

    @GetMapping("/hello")
    public String hello() {
        return "Server is running!";
    }

    @PostMapping("/create-user")
    public String createTestUser() {
        try {
            User user = new User();
            user.setName("Test User");
            user.setEmail("test@test.com");
            user.setPassword("password123");
            user.setPhone("1234567890");
            user.setAddress("Test Address");
            user.setLocation("Test City");

            User savedUser = userService.createUser(user);
            return "User created with ID: " + savedUser.getId();
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    @GetMapping("/check-users")
    public String checkUsers() {
        try {
            long count = userService.getAllUsers().size();
            return "Total users in database: " + count;
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}
