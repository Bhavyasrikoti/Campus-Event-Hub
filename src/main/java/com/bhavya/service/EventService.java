package com.bhavya.campus_event_hub.service;

import com.bhavya.campus_event_hub.dto.EventRequest;
import com.bhavya.campus_event_hub.entity.Event;
import com.bhavya.campus_event_hub.entity.User;
import com.bhavya.campus_event_hub.exception.ResourceNotFoundException;
import com.bhavya.campus_event_hub.repository.EventRepository;
import com.bhavya.campus_event_hub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventService(
            EventRepository eventRepository,
            UserRepository userRepository) {

        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    public Event createEvent(EventRequest request) {

        User creator = userRepository.findById(request.getCreatedBy())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Creator not found"));

        Event event = new Event();

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setEventTime(request.getEventTime());
        event.setLocation(request.getLocation());
        event.setCapacity(request.getCapacity());
        event.setAvailableSeats(request.getCapacity());
        event.setCreatedBy(creator);

        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Event not found"));
    }
}