package com.bhavya.campus_event_hub.repository;

import com.bhavya.campus_event_hub.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    Optional<Registration> findByUserIdAndEventId(Long userId, Long eventId);

    List<Registration> findByUserId(Long userId);
}