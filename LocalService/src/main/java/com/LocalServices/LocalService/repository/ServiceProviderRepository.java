package com.LocalServices.LocalService.repository;

import com.LocalServices.LocalService.model.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {
    Optional<ServiceProvider> findByEmail(String email);
    Boolean existsByEmail(String email);

    @Query("SELECT sp FROM ServiceProvider sp WHERE :serviceType MEMBER OF sp.serviceTypes AND sp.location LIKE %:location%")
    List<ServiceProvider> findByServiceTypeAndLocation(@Param("serviceType") String serviceType,
                                                       @Param("location") String location);

    List<ServiceProvider> findByLocationContaining(String location);

    // New method to find by service type in the list
    @Query("SELECT sp FROM ServiceProvider sp WHERE :serviceType MEMBER OF sp.serviceTypes")
    List<ServiceProvider> findByServiceType(@Param("serviceType") String serviceType);
}