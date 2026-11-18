
// Get the password setup form
const setPasswordForm = document.getElementById("setPasswordForm");

// Get the password fields
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

// Get the feedback message and button
const passwordMessage = document.getElementById("passwordMessage");
const setPasswordButton = document.getElementById("setPasswordButton");

// The email address authorised for this invitation
const ADMIN_EMAIL = "Recruitmentngr@gmail.com";

// Supabase project details
const SUPABASE_URL = "https://oakpxhjfnhrdnjvxgaxb.supabase.co";

//publishable key
const SUPABASE_KEY = "sb_publishable_t3NH4LkeAzPk0oEdbVJuYQ_WhaC6oLD";

// Display a message on the page
function showMessage(message, type) {
    passwordMessage.textContent = message;
    passwordMessage.className = "login-message " + type;
}

// Load Supabase JavaScript library
const supabaseScript = document.createElement("script");

supabaseScript.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

supabaseScript.onload = async function () {

    // Connect to Supabase
    const supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    // Check whether the invitation link created a valid session
    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
        showMessage(
            "Invalid or expired invitation link. Please request a new invitation.",
            "text-danger"
        );

        setPasswordForm.style.display = "block";

setPasswordButton.disabled = true;
newPassword.disabled = true;
confirmPassword.disabled = true;

return;
    }

    // Confirm this invitation belongs to the intended admin
    const invitedUser = data.user;

    if (
    invitedUser.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()
) {
        showMessage(
            "This invitation is not valid for this account.",
            "text-danger"
        );

       setPasswordForm.style.display = "block";

setPasswordButton.disabled = true;
newPassword.disabled = true;
confirmPassword.disabled = true;

return;
    }

    // Handle password submission
    setPasswordForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const password = newPassword.value;
        const confirmPasswordValue = confirmPassword.value;

        // Check password length
        if (password.length < 8) {
            showMessage(
                "Password must contain at least 8 characters.",
                "text-danger"
            );
            return;
        }

        // Check that passwords match
        if (password !== confirmPasswordValue) {
            showMessage(
                "Your passwords do not match.",
                "text-danger"
            );
            return;
        }

        // Show loading state
        setPasswordButton.disabled = true;
        setPasswordButton.textContent = "Setting Password...";

        showMessage("", "");

        // Update the authenticated user's password
        const { error: updateError } =
            await supabaseClient.auth.updateUser({
                password: password
            });

        if (updateError) {
            showMessage(updateError.message, "text-danger");

            setPasswordButton.disabled = false;
            setPasswordButton.textContent = "Set Password";
            return;
        }

        // Show success message
        showMessage(
            "Your password has been created successfully!",
            "text-success"
        );

        // Clear the form
        setPasswordForm.reset();

        // Redirect to admin login
        setTimeout(function () {
            window.location.href = "admin-login.html";
        }, 2500);

    });
};

// Handle failure to load Supabase
supabaseScript.onerror = function () {
    showMessage(
        "Unable to connect. Please refresh the page.",
        "text-danger"
    );
};

// Add Supabase library to the page
document.head.appendChild(supabaseScript);
