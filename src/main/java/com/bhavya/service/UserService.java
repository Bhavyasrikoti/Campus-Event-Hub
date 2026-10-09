package com.bhavya.campus_event_hub.service;

import com.bhavya.campus_event_hub.dto.UserRequest;
import com.bhavya.campus_event_hub.dto.UserResponse;
import com.bhavya.campus_event_hub.entity.User;
import com.bhavya.campus_event_hub.exception.DuplicateEmailException;
import com.bhavya.campus_event_hub.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public UserResponse createUser(UserRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateEmailException(
                    "Email already registered");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }
}