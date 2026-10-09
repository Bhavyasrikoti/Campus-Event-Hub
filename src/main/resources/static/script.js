
let currentUserId = null;
let currentUserRole = null;

// Read JSON or plain-text API responses safely.
async function readResponse(response) {
    const text = await response.text();

    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

function getErrorMessage(data) {
    if (typeof data === "string") return data;
    if (data?.message) return data.message;

    if (data && typeof data === "object") {
        return Object.values(data).join("; ");
    }

    return "Request failed. Please try again.";
}

// ===============================
// SHOW / HIDE ORGANIZER DASHBOARD
// ===============================

function showOrganizerDashboard() {
    const dashboard = document.getElementById("organizerDashboard");

    if (dashboard) {
        dashboard.style.display = "block";
        loadOrganizerEvents();
    }
}

function hideOrganizerDashboard() {
    const dashboard = document.getElementById("organizerDashboard");

    if (dashboard) {
        dashboard.style.display = "none";
    }
}

// ===============================
// CREATE USER
// ===============================


document.getElementById("userForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const message = document.getElementById("userMessage");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    
const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

if (!emailPattern.test(email)) {
    message.textContent =
        "Enter a valid email address, such as name@gmail.com.";
    document.getElementById("email").focus();
    return;
}

    if (!role) {
        message.textContent = "Please select Student or Organizer.";
        return;
    }

    message.textContent = "Creating account...";

    try {
        const response = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await readResponse(response);

        if (!response.ok) {
            message.textContent = getErrorMessage(data);
            return;
        }

        // Switch the current account to the newly created user.
        currentUserId = data.id;
        currentUserRole = data.role;

        message.textContent =
            `Account created successfully as ${currentUserRole}.`;

        form.reset();

        if (currentUserRole === "ORGANIZER") {
            // Hide the student registration list.
            const registrationsContainer =
                document.getElementById("registrationsContainer");

            if (registrationsContainer) {
                registrationsContainer.innerHTML = "";
            }

            showOrganizerDashboard();
            await loadEvents();
            await loadOrganizerEvents();

        } else {
            // Hide organizer-only content.
            hideOrganizerDashboard();

            await loadEvents();
            await loadRegistrations();
        }

    } catch (error) {
        console.error("Account creation error:", error);
        message.textContent =
            "Unable to complete account creation. Check the browser console.";
    }
});
// ===============================
// LOAD ALL EVENTS
// ===============================

async function loadEvents() {
    const container = document.getElementById("eventsContainer");

    try {
        const response = await fetch("/api/events");
        const events = await readResponse(response);

        if (!response.ok) {
            throw new Error(getErrorMessage(events));
        }

        container.innerHTML = "";

        if (!Array.isArray(events) || events.length === 0) {
            container.innerHTML = "<p>No events available.</p>";
            return;
        }

        events.forEach(event => {
            const card = document.createElement("div");
            card.className = "event";
            card.dataset.eventId = event.id;


            const title = document.createElement("h3");
            title.textContent = event.title;

            const description = document.createElement("p");
            description.textContent = event.description || "";

            const details = document.createElement("p");
            details.textContent =
                `Date: ${event.eventDate} | Time: ${event.eventTime}`;

            const location = document.createElement("p");
            location.textContent = `Location: ${event.location}`;

            const seats = document.createElement("p");
            seats.textContent =
                `Available Seats: ${event.availableSeats}/${event.capacity}`;

            const button = document.createElement("button");
            button.textContent = "Register";
            button.addEventListener("click", () => registerForEvent(event.id));

            if (Number(event.availableSeats) <= 0) {
                button.disabled = true;
                button.textContent = "Fully Booked";
            }

            card.append(title, description, details, location, seats, button);
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Load events error:", error);
        container.innerHTML = "<p>Unable to load events.</p>";
    }
}

// ===============================
// REGISTER FOR EVENT
// ===============================


async function registerForEvent(eventId) {
    const eventCard = document.querySelector(
        `[data-event-id="${eventId}"]`
    );

    if (!currentUserId) {
        showEventMessage(
            eventCard,
            "Please create a student account first.",
            "error"
        );
        return;
    }

    if (currentUserRole !== "STUDENT") {
        showEventMessage(
            eventCard,
            "Please create a student account to register for events.",
            "error"
        );
        return;
    }

    try {
        const response = await fetch(
            `/api/registrations?userId=${currentUserId}&eventId=${eventId}`,
            { method: "POST" }
        );

        const data = await readResponse(response);

        if (!response.ok) {
            throw new Error(getErrorMessage(data));
        }

        
await loadEvents();

const refreshedCard = document.querySelector(
    `[data-event-id="${eventId}"]`
);

showEventMessage(
    refreshedCard,
    "Registration successful!",
    "success"
);

await loadRegistrations();
await loadOrganizerEvents();

    } catch (error) {
        showEventMessage(
            eventCard,
            error.message || "Registration failed. Please try again.",
            "error"
        );
    }
}


function showEventMessage(container, message, type) {
    if (!container) {
        console.error(message);
        return;
    }

    let messageElement = container.querySelector(".event-feedback");

    if (!messageElement) {
        messageElement = document.createElement("p");
        messageElement.className = "event-feedback";
        messageElement.setAttribute("role", "status");
        container.prepend(messageElement);
    }

    messageElement.textContent = message;
    messageElement.className = `event-feedback ${type}`;
}


// ===============================
// LOAD USER REGISTRATIONS
// ===============================


async function loadRegistrations() {
    const container = document.getElementById("registrationsContainer");

    if (!container) return;

    // Organizers should not see the student registration list.
    if (currentUserRole === "ORGANIZER") {
        container.innerHTML = "";
        return;
    }

    if (!currentUserId || currentUserRole !== "STUDENT") {
        container.innerHTML =
            "<p>Create a student account to view registrations.</p>";
        return;
    }

    try {
        container.innerHTML = "<p>Loading your registrations...</p>";

        const response = await fetch(
            `/api/registrations/user/${currentUserId}`
        );

        const registrations = await readResponse(response);

        if (!response.ok) {
            throw new Error(getErrorMessage(registrations));
        }

        container.innerHTML = "";

        if (!Array.isArray(registrations) || registrations.length === 0) {
            container.innerHTML = "<p>No registrations found.</p>";
            return;
        }

        registrations.forEach(registration => {
            const card = document.createElement("div");
            card.className = "registration";

            const title = document.createElement("p");
            title.textContent = registration.event?.title || "Event";

            const status = document.createElement("p");
            status.textContent = `Status: ${registration.status}`;

            card.append(title, status);

            if (registration.status === "ACTIVE") {
                const button = document.createElement("button");
                button.textContent = "Cancel Registration";

                button.addEventListener("click", () => {
                    cancelRegistration(registration.id);
                });

                card.appendChild(button);
            }

            container.appendChild(card);
        });
    } catch (error) {
        console.error("Load registrations error:", error);
        container.innerHTML = "<p>Unable to load registrations.</p>";
    }
}

// ===============================
// CANCEL REGISTRATION
// ===============================


async function cancelRegistration(registrationId) {
    try {
        const response = await fetch(
            `/api/registrations/${registrationId}`,
            { method: "DELETE" }
        );

        const data = await readResponse(response);

        if (!response.ok) {
            throw new Error(getErrorMessage(data));
        }

        await loadEvents();
        await loadRegistrations();
        await loadOrganizerEvents();

        const messageContainer = document.getElementById(
            "registrationsContainer"
        );

        showEventMessage(
            messageContainer,
            "Registration cancelled successfully!",
            "success"
        );

    } catch (error) {
        const messageContainer = document.getElementById(
            "registrationsContainer"
        );

        showEventMessage(
            messageContainer,
            error.message || "Unable to cancel registration.",
            "error"
        );
    }
}

// ===============================
// CREATE EVENT
// ===============================

document.getElementById("eventForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = document.getElementById("eventMessage");

    if (!currentUserId || currentUserRole !== "ORGANIZER") {
        message.textContent = "Create an organizer account first.";
        return;
    }

    const eventData = {
        title: document.getElementById("eventTitle").value.trim(),
        description: document.getElementById("eventDescription").value.trim(),
        eventDate: document.getElementById("eventDate").value,
        eventTime: document.getElementById("eventTime").value,
        location: document.getElementById("eventLocation").value.trim(),
        capacity: Number(document.getElementById("eventCapacity").value),
        createdBy: currentUserId
    };

    message.textContent = "Creating event...";

    try {
        const response = await fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventData)
        });

        const data = await readResponse(response);

        console.log("Event creation status:", response.status);
        console.log("Event creation response:", data);

        if (!response.ok) {
            message.textContent = getErrorMessage(data);
            return;
        }

        message.textContent = "Event created successfully!";
        document.getElementById("eventForm").reset();

        await loadOrganizerEvents();
        await loadEvents();
    } catch (error) {
        console.error("Event creation error:", error);
        message.textContent =
            "Unable to create event. Check the browser console.";
    }
});

// ===============================
// LOAD ORGANIZER'S EVENTS
// ===============================

async function loadOrganizerEvents() {
    const container = document.getElementById("organizerEvents");

    if (!container || !currentUserId || currentUserRole !== "ORGANIZER") {
        return;
    }

    try {
        const response = await fetch("/api/events");
        const events = await readResponse(response);

        if (!response.ok) {
            throw new Error(getErrorMessage(events));
        }

        const myEvents = events.filter(
            event => event.createdBy &&
                String(event.createdBy.id) === String(currentUserId)
        );

        container.innerHTML = "";

        if (myEvents.length === 0) {
            container.innerHTML = "<p>No events created yet.</p>";
            return;
        }

        myEvents.forEach(event => {
            const card = document.createElement("div");
            card.className = "event";

            const title = document.createElement("h4");
            title.textContent = event.title;

            const details = document.createElement("p");
            details.textContent =
                `${event.eventDate} at ${event.eventTime} — ${event.location}`;

            const seats = document.createElement("p");
            seats.textContent =
                `Available seats: ${event.availableSeats}/${event.capacity}`;

            card.append(title, details, seats);
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Organizer events error:", error);
        container.innerHTML = "<p>Unable to load your events.</p>";
    }
}

// ===============================
// INITIAL PAGE LOAD
// ===============================

loadEvents();
loadRegistrations();


// Password visibility toggle
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.textContent = isHidden ? "🙈" : "👁";
    togglePassword.setAttribute("aria-label",
        isHidden ? "Hide password" : "Show password"
    );
    togglePassword.setAttribute("aria-pressed", String(isHidden));
});

// Live password requirement validation
const passwordChecks = [
    {
        id: "ruleLength",
        test: value => value.length >= 8
    },
    {
        id: "ruleUpper",
        test: value => /[A-Z]/.test(value)
    },
    {
        id: "ruleLower",
        test: value => /[a-z]/.test(value)
    },
    {
        id: "ruleDigit",
        test: value => /\d/.test(value)
    },
    {
        id: "ruleSpecial",
        test: value => /[^A-Za-z0-9\s]/.test(value) && !/\s/.test(value)
    }
];

function updatePasswordRules() {
    const value = passwordInput.value;

    passwordChecks.forEach(check => {
        const element = document.getElementById(check.id);
        const valid = check.test(value);

        element.classList.toggle("valid", valid);
        element.classList.toggle("invalid", value.length > 0 && !valid);
        element.textContent =
            `${valid ? "✓" : "○"} ${{
                ruleLength: "At least 8 characters",
                ruleUpper: "One uppercase letter (A–Z)",
                ruleLower: "One lowercase letter (a–z)",
                ruleDigit: "One number (0–9)",
                ruleSpecial: "One special character, no spaces"
            }[check.id]}`;
    });
}

passwordInput.addEventListener("input", updatePasswordRules);
updatePasswordRules();

