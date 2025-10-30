package com.LocalServices.LocalService.service;

import com.LocalServices.LocalService.model.User;
import com.LocalServices.LocalService.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

//@Service
//public class UserService {
//
//    @Autowired
//    UsersRepo usersRepo;
//
//    public Users addUser(Users user){
//        return usersRepo.save(user);
//    }
//
//    public Boolean loginUser(LoginRequest loginRequest){
//        Optional<Users> user = usersRepo.findByEmail(loginRequest.getEmail());
//        if (user == null){
//            return false;
//        }
//        Users user1 = user.get();
//        if (!user1.getPassword().equals(loginRequest.getPassword())){
//            return false;
//        }
//        return true;
//
//    }
//
//}


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setName(userDetails.getName());
        user.setPhone(userDetails.getPhone());
        user.setAddress(userDetails.getAddress());
        user.setLocation(userDetails.getLocation());

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
