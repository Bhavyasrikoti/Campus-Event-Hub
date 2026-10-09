
package com.bhavya.campus_event_hub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UserRequest {

    @NotBlank(message = "Name is required")
    private String name;

    
@NotBlank(message = "Email is required")
@Email(message = "Enter a valid email")
@Pattern(
    regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
    message = "Email must include a valid domain suffix, such as .com or .in"
)
private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must contain at least 8 characters")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9\\s])\\S+$",
        message = "Password must contain uppercase, lowercase, a digit, and a special character, with no spaces"
    )
    private String password;

    @NotBlank(message = "Role is required")
    private String role;

    public UserRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
