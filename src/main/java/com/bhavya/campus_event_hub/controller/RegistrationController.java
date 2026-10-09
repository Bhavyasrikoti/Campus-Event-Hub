package com.bhavya.campus_event_hub.controller;

import com.bhavya.campus_event_hub.entity.Registration;
import com.bhavya.campus_event_hub.service.RegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Registration registerUser(
            @RequestParam Long userId,
            @RequestParam Long eventId) {

        return registrationService.registerUser(userId, eventId);
    }

    @GetMapping("/user/{userId}")
    public List<Registration> getUserRegistrations(
            @PathVariable Long userId) {

        return registrationService.getUserRegistrations(userId);
    }

    @DeleteMapping("/{registrationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelRegistration(
            @PathVariable Long registrationId) {

        registrationService.cancelRegistration(registrationId);
    }
}