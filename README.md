# Campus Event Hub and Ticketing System

A web-based campus event management application that allows students to explore campus events, register for available seats, and manage their registrations. Organizers can create events and monitor event details.

## Features

### Student Features

* View available campus events and event details.
* Register for events with available seats.
* Prevent duplicate registrations for the same event.
* View personal event registrations.
* Cancel active registrations.
* View updated seat availability after registration or cancellation.

### Organizer Features

* Create and publish campus events.
* Specify event details such as title, description, date, time, location, and capacity.
* View events created by the organizer.

### Validation and Error Handling

* Validate required account fields and email format.
* Enforce password complexity requirements during account creation.
* Prevent registrations when an event has no seats remaining.
* Handle duplicate registration attempts.
* Return appropriate API errors for invalid requests and missing resources.

## Tech Stack

**Backend**

* Java
* Spring Boot
* Spring Data JPA
* Hibernate
* Maven

**Database**

* MySQL

**Frontend**

* HTML
* CSS
* JavaScript

**Tools**

* Visual Studio Code
* Git and GitHub
* Postman or equivalent HTTP client for API testing

## Application Modules

* **User Management:** Account creation and input validation.
* **Event Management:** Create and retrieve campus events.
* **Registration Management:** Register for events, prevent duplicates, enforce seat limits, and cancel registrations.
* **Database Integration:** Persist users, events, and registrations in MySQL.

## Getting Started

### Prerequisites

* Java JDK compatible with the project configuration.
* MySQL Server.
* Git.

### 1. Clone the repository

```bash
git clone https://github.com/BhavyaSrikoti/Campus-Event-Hub.git
cd Campus-Event-Hub
```

### 2. Create the database

Create a MySQL database named `campus_event_hub`.

```sql
CREATE DATABASE campus_event_hub;
```

Ensure the required tables and schema are initialized according to the project's entity mappings and database configuration.

### 3. Configure database credentials

The application reads database credentials from environment variables. Set `DB_USERNAME` and `DB_PASSWORD` in your terminal before starting the application.

**PowerShell example:**

```powershell
$env:DB_USERNAME = "your_mysql_username"
$env:DB_PASSWORD = "your_mysql_password"
```

Replace the placeholders with your local MySQL credentials. Do not commit credentials to GitHub.

### 4. Run the application

On Windows, from the project root:

```powershell
.\mvnw.cmd spring-boot:run
```

Open the application in your browser:

http://localhost:8080/

Keep the terminal running while using the application.

## API Overview

| Method | Endpoint                                               | Purpose                         |
| ------ | ------------------------------------------------------ | ------------------------------- |
| POST   | `/api/users`                                           | Create a user account           |
| GET    | `/api/events`                                          | Retrieve available events       |
| GET    | `/api/events/{id}`                                     | Retrieve an event by ID         |
| POST   | `/api/events`                                          | Create an event                 |
| POST   | `/api/registrations?userId={userId}&eventId={eventId}` | Register a user for an event    |
| GET    | `/api/registrations/user/{userId}`                     | Retrieve a user's registrations |
| DELETE | `/api/registrations/{registrationId}`                  | Cancel a registration           |

## Key Learning Outcomes

* Building REST APIs using Spring Boot.
* Connecting a Java application to MySQL using Spring Data JPA.
* Designing relationships between users, events, and registrations.
* Implementing validation, exception handling, and duplicate-registration checks.
* Managing event capacity and registration updates through transactional service logic.
* Integrating a JavaScript frontend with backend REST endpoints.
* Using Git and GitHub for version control.

## Future Improvements

* Implement secure authentication and role-based authorization.
* Add event search, filtering, and sorting.
* Add automated unit and integration tests.
* Deploy the application so it can be accessed online.

## Author

**Bhavya Sri Koti**

GitHub: https://github.com/BhavyaSrikoti
