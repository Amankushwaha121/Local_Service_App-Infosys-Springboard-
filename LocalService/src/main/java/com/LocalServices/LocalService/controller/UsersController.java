//package com.LocalServices.LocalService.controller;
//
//import com.LocalServices.LocalService.entity.Users;
//import com.LocalServices.LocalService.repository.UsersRepo;
//import com.LocalServices.LocalService.requests.LoginRequest;
//import com.LocalServices.LocalService.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class UsersController {
//
//    @Autowired
//    UserService userService;
//
//    @PostMapping("/addUser")
//    @CrossOrigin(origins = "http://localhost:5173")
//    public Users addUser(@RequestBody Users user){
//
//        return userService.addUser(user);
//    }
//    @PostMapping("/loginUser")
//    @CrossOrigin(origins = "http://localhost:5173")
//    public Boolean loginUser(@RequestBody LoginRequest loginRequest){
//
//        return userService.loginUser(loginRequest);
//    }
//}
