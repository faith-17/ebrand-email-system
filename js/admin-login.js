
/* =====================================
   eBrand Promotion - Admin Login
===================================== */

// Select the admin login form
const adminLoginForm = document.getElementById("adminLoginForm");

// Select the password input
const adminPassword = document.getElementById("adminPassword");

// Select the password visibility button
const togglePassword = document.getElementById("togglePassword");

// Select the eye icon
const passwordIcon = togglePassword.querySelector("i");

// Select the login feedback area
const loginMessage = document.getElementById("loginMessage");


// =====================================
// Show and Hide Password
// =====================================

togglePassword.addEventListener("click", function () {

    // Check the current password field type
    const isPasswordHidden = adminPassword.type === "password";

    // Change the field type
    adminPassword.type = isPasswordHidden ? "text" : "password";

    // Change the eye icon
    passwordIcon.classList.toggle("bi-eye");
    passwordIcon.classList.toggle("bi-eye-slash");

    // Update accessibility label
    togglePassword.setAttribute(
        "aria-label",
        isPasswordHidden ? "Hide password" : "Show password"
    );

});


// =====================================
// Admin Login Form Preparation
// =====================================

adminLoginForm.addEventListener("submit", function (event) {

    // Prevent the browser from refreshing
    event.preventDefault();

    // Clear previous feedback
    loginMessage.textContent = "";

    // Temporary preparation message
    loginMessage.textContent =
        "Login connection will be activated after admin setup.";

});
