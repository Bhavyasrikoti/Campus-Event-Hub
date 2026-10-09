package com.bhavya.campus_event_hub.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateRegistrationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public String handleDuplicateRegistration(
            DuplicateRegistrationException ex) {

        return ex.getMessage();
    }

    @ExceptionHandler(EventFullException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public String handleEventFull(EventFullException ex) {

        return ex.getMessage();
    }

    @ExceptionHandler(DuplicateEmailException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public String handleDuplicateEmail(
            DuplicateEmailException ex) {

        return ex.getMessage();
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleResourceNotFound(
            ResourceNotFoundException ex) {

        return ex.getMessage();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return errors;
    }
}