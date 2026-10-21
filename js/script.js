document.addEventListener("DOMContentLoaded", function () {
    initFormValidation();   // Task 1
    initAccordion();        // Task 2
    initPopup();            // Task 3
    initBackgroundColor();  // Task 4
    initDateTime();         // Task 5
});

// ================= TASK 1. FORM VALIDATION =================

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function showError(input, message) {
    clearError(input);
    input.classList.add("is-invalid");
    const error = document.createElement("div");
    error.className = "invalid-feedback";
    error.textContent = message;
    input.insertAdjacentElement("afterend", error);
}

function clearError(input) {
    input.classList.remove("is-invalid");
    const next = input.nextElementSibling;
    if (next && next.classList.contains("invalid-feedback")) next.remove();
}

function validateRequired(input, message) {
    if (input.value.trim() === "") { showError(input, message); return false; }
    clearError(input);
    return true;
}

function validateEmail(input) {
    const value = input.value.trim();
    if (value === "") { showError(input, "Email is required."); return false; }
    if (!EMAIL_PATTERN.test(value)) {
        showError(input, "Enter a valid email, for example name@mail.com.");
        return false;
    }
    clearError(input);
    return true;
}

function validatePassword(input) {
    if (input.value === "") { showError(input, "Password is required."); return false; }
    if (input.value.length < 8) {
        showError(input, "Password must be at least 8 characters long.");
        return false;
    }
    clearError(input);
    return true;
}

function validateConfirm(passwordInput, confirmInput) {
    if (confirmInput.value === "") {
        showError(confirmInput, "Please confirm your password.");
        return false;
    }
    if (confirmInput.value !== passwordInput.value) {
        showError(confirmInput, "Passwords do not match.");
        return false;
    }
    clearError(confirmInput);
    return true;
}

function showSuccess(form, text) {
    let box = form.querySelector(".form-success");
    if (!box) {
        box = document.createElement("div");
        box.className = "form-success alert alert-success mt-3 mb-0";
        form.appendChild(box);
    }
    box.textContent = text;
}

function hideSuccess(form) {
    const box = form.querySelector(".form-success");
    if (box) box.remove();
}

function initFormValidation() {

    // ---------- Registration form ----------
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        const name = document.getElementById("regName");
        const email = document.getElementById("regEmail");
        const password = document.getElementById("regPassword");
        const confirm = document.getElementById("regConfirm");

        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            hideSuccess(registerForm);

            const results = [
                validateRequired(name, "Name is required."),
                validateEmail(email),
                validatePassword(password),
                validateConfirm(password, confirm)
            ];

            if (results.every(Boolean)) {
                showSuccess(registerForm, "Registration successful! Welcome to World Cuisine.");
                registerForm.reset();
            }
        });

        name.addEventListener("blur", () => validateRequired(name, "Name is required."));
        email.addEventListener("blur", () => validateEmail(email));
        password.addEventListener("blur", () => validatePassword(password));
        confirm.addEventListener("blur", () => validateConfirm(password, confirm));
    }

    // ---------- Contact form ----------
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        const name = document.getElementById("name");
        const email = document.getElementById("email");
        const cuisine = document.getElementById("cuisine");
        const message = document.getElementById("message");
        const confirm = document.getElementById("confirm");

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            hideSuccess(contactForm);

            const results = [
                validateRequired(name, "Name is required."),
                validateEmail(email)
            ];

            if (cuisine.selectedIndex === 0) {
                showError(cuisine, "Please choose a cuisine.");
                results.push(false);
            } else {
                clearError(cuisine);
                results.push(true);
            }

            if (message.value.trim().length < 10) {
                showError(message, "Recommendation must be at least 10 characters.");
                results.push(false);
            } else {
                clearError(message);
                results.push(true);
            }

            const checkboxError = document.getElementById("confirmError");
            if (!confirm.checked) {
                confirm.classList.add("is-invalid");
                checkboxError.textContent = "Please confirm your recommendation.";
                results.push(false);
            } else {
                confirm.classList.remove("is-invalid");
                checkboxError.textContent = "";
                results.push(true);
            }

            if (results.every(Boolean)) {
                showSuccess(contactForm, "Thank you! Your recommendation was sent.");
                contactForm.reset();
            }
        });

        name.addEventListener("blur", () => validateRequired(name, "Name is required."));
        email.addEventListener("blur", () => validateEmail(email));
    }
}

// ================= TASK 2. ACCORDION =================

function initAccordion() {
    const items = document.querySelectorAll(".faq-item");

    items.forEach(function (item) {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        question.addEventListener("click", function () {
            if (item.classList.contains("open")) {
                item.classList.remove("open");
                answer.style.maxHeight = "0px";
                question.setAttribute("aria-expanded", "false");
            } else {
                item.classList.add("open");
                answer.style.maxHeight = answer.scrollHeight + "px";
                question.setAttribute("aria-expanded", "true");
            }
        });
    });
}

// ================= TASK 3. POPUP =================

function initPopup() {
    const openBtn = document.getElementById("openPopup");
    const overlay = document.getElementById("popupOverlay");
    if (!openBtn || !overlay) return;

    const closeBtn = document.getElementById("closePopup");
    const form = document.getElementById("subscribeForm");
    const emailInput = document.getElementById("subEmail");

    function openPopup() {
        overlay.classList.add("show");
        document.body.style.overflow = "hidden";
        emailInput.focus();
    }

    function closePopup() {
        overlay.classList.remove("show");
        document.body.style.overflow = "";
        clearError(emailInput);
        hideSuccess(form);
    }

    openBtn.addEventListener("click", openPopup);
    closeBtn.addEventListener("click", closePopup);

    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) closePopup();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && overlay.classList.contains("show")) closePopup();
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        hideSuccess(form);
        if (validateEmail(emailInput)) {
            showSuccess(form, "Thanks for subscribing!");
            form.reset();
            setTimeout(closePopup, 1500);
        }
    });
}

// ================= TASK 4. BACKGROUND COLOR =================

function initBackgroundColor() {
    const button = document.getElementById("colorBtn");
    if (!button) return;

    const colors = ["#f7f7f3", "#fde8e0", "#e3f2e1", "#e0ecfb", "#fff4cc", "#ece3f7"];
    let index = 0;

    button.addEventListener("click", function () {
        index = (index + 1) % colors.length;
        document.body.style.backgroundColor = colors[index];
    });
}

// ================= TASK 5. DATE AND TIME =================

function initDateTime() {
    const box = document.getElementById("datetime");
    if (!box) return;

    function update() {
        const now = new Date();
        const date = now.toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric"
        });
        const time = now.toLocaleTimeString("en-US", {
            hour: "numeric", minute: "2-digit", second: "2-digit"
        });
        box.textContent = date + ", " + time;
    }

    update();
    setInterval(update, 1000);
}