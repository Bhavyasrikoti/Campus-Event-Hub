package com.bhavya.campus_event_hub.repository;

import com.bhavya.campus_event_hub.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}