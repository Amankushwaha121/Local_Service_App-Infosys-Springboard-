package com.LocalServices.LocalService.repository;

import com.LocalServices.LocalService.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProviderId(Long providerId);
    List<Review> findByUserId(Long userId);
}