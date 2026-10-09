package com.bhavya.campus_event_hub.service;

import com.bhavya.campus_event_hub.entity.Event;
import com.bhavya.campus_event_hub.entity.Registration;
import com.bhavya.campus_event_hub.entity.User;
import com.bhavya.campus_event_hub.exception.DuplicateRegistrationException;
import com.bhavya.campus_event_hub.exception.EventFullException;
import com.bhavya.campus_event_hub.repository.EventRepository;
import com.bhavya.campus_event_hub.repository.RegistrationRepository;
import com.bhavya.campus_event_hub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.bhavya.campus_event_hub.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    public RegistrationService(
            RegistrationRepository registrationRepository,
            UserRepository userRepository,
            EventRepository eventRepository) {

        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
    }

    @Transactional
    public Registration registerUser(Long userId, Long eventId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if (registrationRepository
                .findByUserIdAndEventId(userId, eventId)
                .isPresent()) {

            throw new DuplicateRegistrationException(
                    "User is already registered for this event");
        }

        if (event.getAvailableSeats() <= 0) {
            throw new EventFullException("Event is fully booked");
        }

        Registration registration = new Registration();

        registration.setUser(user);
        registration.setEvent(event);
        registration.setStatus("ACTIVE");

        event.setAvailableSeats(event.getAvailableSeats() - 1);

        eventRepository.save(event);

        return registrationRepository.save(registration);
    }

    public List<Registration> getUserRegistrations(Long userId) {
        return registrationRepository.findByUserId(userId);
    }

    @Transactional
    public void cancelRegistration(Long registrationId) {

        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));

        if ("CANCELLED".equals(registration.getStatus())) {
            throw new RuntimeException("Registration is already cancelled");
        }

        Event event = registration.getEvent();

        registration.setStatus("CANCELLED");

        if (event.getAvailableSeats() < event.getCapacity()) {
            event.setAvailableSeats(event.getAvailableSeats() + 1);
        }

        eventRepository.save(event);
        registrationRepository.save(registration);
    }
}