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

// =====================================================
// ASSIGNMENT 5. ADVANCED JS AND DOM MANIPULATION
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
    initTheme();          // Day / Night theme
    initReadMore();       // Read More (Countries)
    initKeyboardNav();    // keyboard navigation
    initRating();         // dish rating (Dishes)
    initRecipeFilter();   // recipe filter with switch (Recipes)
    initRestaurants();    // objects + array (Restaurants)
    initMultiStepForm();  // multi-step form + reset (Contact)
});


// ---------- shared helpers: sound and animation ----------

// short click sound, embedded in the code (no audio file needed)
const clickSound = new Audio("data:audio/wav;base64,UklGRoQEAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWAEAACAtNjiz6RuPiEiP3Cmz+DSq3ZEJSRAcKXO3c2kbz8mKkt+sdPYv5BcNCY4Y5jE18ukcEEqMVaJudPOrHlJLTFThrbRzKp3SC81WYy60MafbEEvP2mcw864ilg3NVKDssvEn21DNEZxo8XHqnpMNkFpm8DHrn9QOEFomb7Fq3xPOUZunsDCo3NJO056qcK6lGRCQF6NtcGrflI+THakv7iTZEREZZS4vaByS0JbiLC9p3tSQlaBq7yqf1VEVYCqu6l+VUVYg6u5pHlSR16Kr7eccE1LaZW0sY9jSlN5o7amfVZKYYyvspNoTVN3obSje1ZNZ5KwrIphTVyEqbCVa1BWeqKxnHNTU3ScsKB5VlNwma+he1hTcJiuoHpYVXKZrZ13V1d3nayYcVVbfqKqkGlUYoinpYVhVm2TqZ14Wlt7n6iPaVZmi6agfl1ad5unkGtYZ4ylnXtdXXyepIpmWm+TpZVxWmaJo5x7XmB/nqGEY113maOLaFxylaOPbFxukaKScF1sjqKTcV5sjqGTcV5tjqGScF9ukKCPbl9ykp+La2B2lp6GZ2N9mpt/ZGeEnZZ3Ym2Mno5vYnaUnIRnZoCalnljboycjG5keZaZf2Zqh5uPcWR3lJmAZ2uHmo5xZXmUl35nbYqaim5nfpeTd2Z0kJiCaWyHmYtvaH6WkXZnd5GVfmhxjJeEa2yGl4pvaoGWjnNpfJSQd2l5kpJ6aXaQk3xqdI6UfmpzjZR/a3OMlH9rc4yUf2t0jZN+a3WNkn1rd4+Remt5kI94bHyRjXVtgJKJcm6Ek4VvcYiSgG12jZB7bXuQjHVugZKGcXKIkYBud42OeG5/kIhycYaRgG94jY14b4CQhXF0iY98b3yPiXRyho9/b3qNinVxhI+AcHmNinZyhI+AcHqNiXVzho5+cH2OhnN1iIx6cYGOgnJ5i4l2c4aNfXF/jYRzeIuJd3SFjHxygI2Cc3qLh3V2iIt5c4OMfnJ/jIJze4uGdXeJiXh1hot7dIKMfnN/jIFzfYuEdHqKhnZ5iYd3d4eIeHaGiXp1hYp7dYSKfHWDin11gop9dYKKfXWBin51gYp+dYKKfXWCin11g4l8doOJe3aEiHp3hYh5eIaHeHmHhXd7iIR3fImCdn6Jf3aBiX13g4h7eIWGeXqHhHd8iIF3f4h+d4KIe3iFhnl7h4N3foh/d4KHfHiFhXl7h4J3f4h+eIOGenqGg3h+h394g4Z7eoaDeH6HfniDhnp7hoJ4gId9eYSEeX2HgHiChnt7hoJ4gIZ8eoWDeX6HfnmEhHl9hn95g4V6fYZ/eYKFen2Gf3mChXp9hn95g4R6fYZ/eoODen6GfnqEgnqAhXx7hYF5gYV7fYV/eoODen+FfXuEgXqBhHt9hX57hIJ6gIV8fYV/eoOCeoCFfH2Ff3uDgnqAhHx9hX57hIF6gYR7foV9fISAe4OCe4CEfH6EfnyEgHuCgnuAhHx+hH18hH97g4F7gYN7");

function playClickSound() {
    clickSound.currentTime = 0;            // restart, so sounds never overlap
    clickSound.play().catch(function () {});
}

// restarts a CSS animation on an element
function animate(element, className) {
    element.classList.remove(className);
    void element.offsetWidth;              // force the browser to restart the animation
    element.classList.add(className);
    element.addEventListener("animationend", function () {
        element.classList.remove(className);
    }, { once: true });
}


// =====================================================
// 2.1 DAY AND NIGHT THEME
// =====================================================

function initTheme() {
    const body = document.body;
    const button = document.getElementById("themeBtn");

    // apply the saved theme on every page
    try {
        if (localStorage.getItem("theme") === "night") {
            body.classList.add("night");
        }
    } catch (error) {}

    if (!button) return;

    function updateButton() {
        button.textContent = body.classList.contains("night") ? "☀️ Day mode" : "🌙 Night mode";
    }

    updateButton();

    button.addEventListener("click", function () {
        body.classList.toggle("night");
        body.style.backgroundColor = "";   // clear color set by "Change background"
        updateButton();
        animate(button, "pop");

        try {
            localStorage.setItem("theme", body.classList.contains("night") ? "night" : "day");
        } catch (error) {}
    });
}


// =====================================================
// 2.2 READ MORE (Countries)
// =====================================================

function initReadMore() {
    const buttons = document.querySelectorAll(".read-more-btn");

    buttons.forEach(function (button) {
        const extra = button.nextElementSibling;   // hidden paragraph after the button

        button.addEventListener("click", function () {
            const isHidden = getComputedStyle(extra).display === "none";

            extra.style.display = isHidden ? "block" : "none";
            button.textContent = isHidden ? "Read less" : "Read more";

            if (isHidden) animate(extra, "fade-in");
        });
    });
}


// =====================================================
// 2.3 KEYBOARD NAVIGATION
// =====================================================

function initKeyboardNav() {
    const links = document.querySelectorAll(".navbar-nav .nav-link");
    if (links.length === 0) return;

    links.forEach(function (link, index) {
        link.addEventListener("keydown", function (event) {
            let target = null;

            switch (event.key) {
                case "ArrowRight":
                case "ArrowDown":
                    target = links[(index + 1) % links.length];
                    break;
                case "ArrowLeft":
                case "ArrowUp":
                    target = links[(index - 1 + links.length) % links.length];
                    break;
                case "Home":
                    target = links[0];
                    break;
                case "End":
                    target = links[links.length - 1];
                    break;
            }

            if (target) {
                event.preventDefault();
                target.focus();
            }
        });
    });
}


// =====================================================
// 3.1 DISH RATING (Dishes)
// =====================================================

function initRating() {
    const cards = document.querySelectorAll(".gallery-item");
    if (cards.length === 0) return;   // only the Dishes page has the gallery

    // add 5 stars and a value label to every dish card
    cards.forEach(function (card) {
        const rating = document.createElement("div");
        rating.className = "rating";

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement("span");
            star.className = "star";
            star.dataset.value = i;
            star.textContent = "★";
            rating.appendChild(star);
        }

        const label = document.createElement("span");
        label.className = "rating-value";
        label.textContent = "Rate it";
        rating.appendChild(label);

        card.appendChild(rating);
    });

    // select all rating blocks and make the stars clickable
    document.querySelectorAll(".rating").forEach(function (rating) {
        const stars = rating.querySelectorAll(".star");
        const label = rating.querySelector(".rating-value");
        const card = rating.closest(".gallery-item");

        stars.forEach(function (star) {
            star.addEventListener("click", function () {
                const value = Number(star.dataset.value);

                // highlight all stars up to the selected one
                stars.forEach(function (item) {
                    item.classList.toggle("active", Number(item.dataset.value) <= value);
                });

                label.textContent = value + "/5";
                playClickSound();
                animate(card, "pop");
            });
        });
    });
}


// =====================================================
// 3.2 RECIPE FILTERING (Recipes)
// =====================================================

function initRecipeFilter() {
    const buttons = document.querySelectorAll(".filter-btn");
    if (buttons.length === 0) return;

    const count = document.getElementById("recipeCount");

    // array of recipe objects built from the recipe cards
    const recipes = Array.from(document.querySelectorAll(".recipe-box")).map(function (card) {
        return { element: card, category: card.dataset.category };
    });

    function filterRecipes(category) {
        let matches;

        switch (category) {
            case "asian":
                matches = function (recipe) { return recipe.category === "asian"; };
                break;
            case "european":
                matches = function (recipe) { return recipe.category === "european"; };
                break;
            case "latin":
                matches = function (recipe) { return recipe.category === "latin"; };
                break;
            default:   // "all"
                matches = function () { return true; };
        }

        const visible = recipes.filter(matches);

        recipes.forEach(function (recipe) {
            recipe.element.style.display = "none";
        });

        visible.forEach(function (recipe) {
            recipe.element.style.display = "block";
            animate(recipe.element, "fade-in");
        });

        count.textContent = "Showing " + visible.length + " of " + recipes.length + " recipes";
    }

    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            buttons.forEach(function (item) { item.classList.remove("active"); });
            button.classList.add("active");

            playClickSound();
            filterRecipes(button.dataset.filter);
        });
    });

    filterRecipes("all");
}


// =====================================================
// 4.1 RESTAURANT OBJECTS (Restaurants)
// =====================================================

// creates a restaurant object with properties and a method
function createRestaurant(name, cuisine, location, dish, rating, image) {
    return {
        name: name,
        cuisine: cuisine,
        location: location,
        dish: dish,
        rating: rating,
        image: image,
        getStars: function () {
            const full = Math.round(this.rating);
            return "★".repeat(full) + "☆".repeat(5 - full);
        }
    };
}

function initRestaurants() {
    const list = document.getElementById("restaurantList");
    if (!list) return;

    // array of restaurant objects
    const restaurants = [
        createRestaurant("Qazaq Gourmet", "Kazakh", "Mangilik El Avenue, 29", "Beshbarmak", 4.7,
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3YpenaxYfpdBWsv5BCwe85OqtMxopj1TKLnrFDz2LFReKApVmTysM5UU&s=10"),
        createRestaurant("Felice", "Italian", "Saryarka Avenue, 1", "Pizza", 4.5,
            "https://www.tillamook.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fj8tkpy1gjhi5%2F5OvVmigx6VIUsyoKz1EHUs%2Fb8173b7dcfbd6da341ce11bcebfa86ea%2FSalami-pizza-hero.jpg&w=3840&q=75"),
        createRestaurant("Cafe Momona", "Japanese", "Astana", "Sushi", 4.3,
            "https://korshop.ru/upload/medialibrary/876/ee3v4coehalpgyjkpt64hh7xrixjxyo0/03.jpg"),
        createRestaurant("Korean House", "Korean", "Turan Avenue, 23", "Bibimbap", 4.6,
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFIGRI3Jbb7wY6o-c8I2mQv7iFecNdyVvmvo7f1W7l42GtiKRKp76LAE8&s=10"),
        createRestaurant("The India Gate", "Indian", "Kenesary Street, 51", "Biryani", 4.4,
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTLETHygJZ1iGyBd7EUjwLwTLqVqBbWrtHBL1FpyvRz9j4_4aXa0_CbLs&s=10"),
        createRestaurant("Nopal", "Mexican", "Kenesary Street, 4", "Tacos", 4.2,
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYmvpm14wv_qG-2C9kIlpjkpAm0AOgPERHQTlCO31QRexzLDaoaaQesPIV&s=10")
    ];

    // loop through the array and display every restaurant
    restaurants.forEach(function (restaurant) {
        const card =
            '<div class="col-md-6 col-lg-4">' +
                '<div class="card restaurant-card h-100">' +
                    '<img src="' + restaurant.image + '" class="card-img-top" alt="' + restaurant.cuisine + ' cuisine">' +
                    '<div class="card-body">' +
                        '<span class="badge text-bg-dark mb-2">' + restaurant.cuisine + '</span>' +
                        '<h2 class="card-title h5">' + restaurant.name + '</h2>' +
                        '<p class="card-text">' + restaurant.location + '</p>' +
                        '<p class="card-text">Recommended: ' + restaurant.dish + '</p>' +
                        '<p class="card-text restaurant-rating">' + restaurant.getStars() + ' ' + restaurant.rating + '</p>' +
                    '</div>' +
                '</div>' +
            '</div>';

        list.insertAdjacentHTML("beforeend", card);
    });
}


// =====================================================
// 4.2 MULTI-STEP CONTACT FORM + 4.3 RESET (Contact)
// =====================================================

function initMultiStepForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const steps = form.querySelectorAll(".form-step");
    const indicator = document.getElementById("stepIndicator");
    const nextBtn = document.getElementById("nextBtn");
    const backBtn = document.getElementById("backBtn");
    const resetBtn = document.getElementById("resetBtn");

    let currentStep = 1;   // state: which step is shown now

    // callback: shows the step with the given number
    function showStep(step) {
        currentStep = step;

        steps.forEach(function (item) {
            item.classList.toggle("active", Number(item.dataset.step) === currentStep);
        });

        indicator.textContent = "Step " + currentStep + " of " + steps.length;
    }

    // Next: check step 1 first, then go to step 2
    function goNext() {
        const name = document.getElementById("name");
        const email = document.getElementById("email");

        const results = [
            validateRequired(name, "Name is required."),
            validateEmail(email)
        ];

        if (results.every(Boolean)) {
            showStep(2);
        }
    }

    nextBtn.addEventListener("click", goNext);

    backBtn.addEventListener("click", function () {
        showStep(1);   // values stay in the inputs
    });

    // Enter on step 1 works like the Next button
    form.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && currentStep === 1) {
            event.preventDefault();
            goNext();
        }
    });

    // after a successful submit the form is reset -> go back to step 1
    form.addEventListener("reset", function () {
        showStep(1);
    });

    // ----- Reset button -----
    resetBtn.addEventListener("click", function () {
        form.querySelectorAll("input").forEach(function (input) {
            if (input.type === "checkbox") {
                input.checked = false;
            } else {
                input.value = "";
            }
        });

        form.querySelector("textarea").value = "";
        form.querySelector("select").selectedIndex = 0;

        // remove error messages and red borders
        form.querySelectorAll(".is-invalid").forEach(function (item) {
            item.classList.remove("is-invalid");
        });
        form.querySelectorAll(".invalid-feedback").forEach(function (item) {
            if (item.id === "confirmError") {
                item.textContent = "";
            } else {
                item.remove();
            }
        });

        hideSuccess(form);
        showStep(1);
    });
}