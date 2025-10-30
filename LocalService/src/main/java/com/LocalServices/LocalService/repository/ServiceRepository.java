package com.LocalServices.LocalService.repository;




import com.LocalServices.LocalService.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByServiceTypeContainingAndLocationContaining(String serviceType, String location);
    List<Service> findByProviderId(Long providerId);

    @Query("SELECT s FROM Service s WHERE s.serviceType LIKE %:serviceType% AND s.location LIKE %:location%")
    List<Service> searchServices(@Param("serviceType") String serviceType,
                                 @Param("location") String location);
}