package com.bhavya.campus_event_hub.exception;

public class EventFullException extends RuntimeException {

    public EventFullException(String message) {
        super(message);
    }
}