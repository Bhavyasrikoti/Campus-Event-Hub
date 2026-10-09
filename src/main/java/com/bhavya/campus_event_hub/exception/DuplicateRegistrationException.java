package com.bhavya.campus_event_hub.exception;

public class DuplicateRegistrationException extends RuntimeException {

    public DuplicateRegistrationException(String message) {
        super(message);
    }
}