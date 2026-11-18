
    /*Admin Login */

// login form and its elements
const adminLoginForm = document.getElementById("adminLoginForm");
const adminUsername = document.getElementById("adminUsername");
const adminPassword = document.getElementById("adminPassword");
const togglePassword = document.getElementById("togglePassword");
const loginMessage = document.getElementById("loginMessage");
const loginButton = document.getElementById("loginButton");

// Supabase project details
const SUPABASE_URL = "https://oakpxhjfnhrdnjvxgaxb.supabase.co";
const SUPABASE_KEY = "sb_publishable_t3NH4LkeAzPk0oEdbVJuYQ_WhaC6oLD";

// Display feedback messages
function showMessage(message, type) {
    loginMessage.textContent = message;
    loginMessage.className = "login-message " + type;
}

// Loading the Supabase JavaScript library
const supabaseScript = document.createElement("script");

supabaseScript.src =
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

// Wait until Supabase is ready
const supabaseReady = new Promise((resolve, reject) => {
    supabaseScript.onload = function () {
        try {
            const client = window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );
            resolve(client);
        } catch (error) {
            reject(error);
        }
    };

    supabaseScript.onerror = reject;
});

document.head.appendChild(supabaseScript);



// Show and Hide Password


if (togglePassword) {
    togglePassword.addEventListener("click", function () {
        const passwordIcon = togglePassword.querySelector("i");

        const isHidden = adminPassword.type === "password";

        adminPassword.type = isHidden ? "text" : "password";

        if (passwordIcon) {
            passwordIcon.classList.toggle("bi-eye");
            passwordIcon.classList.toggle("bi-eye-slash");
        }

        togglePassword.setAttribute(
            "aria-label",
            isHidden ? "Hide password" : "Show password"
        );
    });
}



// Admin Login


adminLoginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = adminUsername.value.trim();
    const password = adminPassword.value;

    if (!email || !password) {
        showMessage("Please enter your email and password.", "text-danger");
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Signing In...";

    showMessage("", "");

    try {
        const supabaseClient = await supabaseReady;

        // Authenticate the administrator
        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) {
            throw new Error("Incorrect email or password. Please try again.");
        }

        // To Check if this account is an authorised administrator
        const { data: adminRecord, error: adminError } =
            await supabaseClient
                .from("admin_users")
                .select("user_id")
                .eq("user_id", data.user.id)
                .maybeSingle();

        if (adminError) {
            await supabaseClient.auth.signOut();
            throw new Error("Unable to verify administrator access.");
        }

        if (!adminRecord) {
            await supabaseClient.auth.signOut();
            throw new Error("You are not authorised to access this dashboard.");
        }

        // Successful login
        showMessage("Login successful. Opening dashboard...", "text-success");

        window.location.href = "admin-dashboard.html";

    } catch (error) {

        showMessage(
            error.message || "Unable to connect. Please try again.",
            "text-danger"
        );

        loginButton.disabled = false;
        loginButton.textContent = "See Message";
    }
});
