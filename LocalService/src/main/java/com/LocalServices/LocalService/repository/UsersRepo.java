package com.LocalServices.LocalService.repository;

import com.LocalServices.LocalService.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepo extends JpaRepository<Users, String> {


    Optional<Users> findByEmail(String email);
}

