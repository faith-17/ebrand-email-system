
// ============================================
// eBrand Promotion - Contact Form
// Supabase Backend Connection
// ============================================


// 1. Supabase connection details

const SUPABASE_URL =
    "https://oakpxhjfnhrdnjvxgaxb.supabase.co";

// We will add the public publishable key here.
// Never use the secret service_role key in frontend code.

const SUPABASE_ANON_KEY =
    "sb_publishable_t3NH4LkeAzPk0oEdbVJuYQ_WhaC6oLD";


// 2. Select the contact form elements

const contactForm = document.getElementById("contactForm");

const formMessage = document.getElementById("formMessage");

const emailAnimation = document.getElementById("emailAnimation");

const submitButton = contactForm.querySelector(
    'button[type="submit"]'
);


// 3. Listen for form submission

contactForm.addEventListener("submit", async function(event) {

    // Prevent the page from refreshing
    event.preventDefault();

    // Clear previous feedback
    formMessage.textContent = "";

    // Record when submission starts
    const startTime = Date.now();

    // Show the email loading animation
    emailAnimation.classList.add("active");

    // Disable the button to prevent duplicate submissions
    submitButton.disabled = true;

    // Change the button text
    submitButton.textContent = "Sending...";


    try {

        // Collect all form fields, including the optional photo
        const formData = new FormData(contactForm);


        // Send the enquiry to our Supabase Edge Function
        const response = await fetch(
            `${SUPABASE_URL}/functions/v1/submit-enquiry`,
            {
                method: "POST",

                headers: {
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
                },

                // The browser automatically sets the multipart
                // Content-Type and boundary for FormData.
                body: formData
            }
        );


        // Read the server response
        const result = await response.json();


        // Check whether the enquiry was successfully received
        if (!response.ok || result.success !== true) {

            throw new Error(
                result.message || "Your enquiry could not be submitted."
            );

        }


        // Keep the animation visible for at least 3 seconds
        const elapsedTime = Date.now() - startTime;

        const remainingTime = Math.max(
            0,
            3000 - elapsedTime
        );

        await new Promise(resolve =>
            setTimeout(resolve, remainingTime)
        );


        // The backend has confirmed that the enquiry was saved.
        // Move the client to the Thank You page.
        window.location.href = "thank-you.html";


    } catch (error) {

        // Display the technical error in the browser console
        console.error("Enquiry submission error:", error);


        // Keep the animation visible for at least 3 seconds
        const elapsedTime = Date.now() - startTime;

        const remainingTime = Math.max(
            0,
            3000 - elapsedTime
        );

        await new Promise(resolve =>
            setTimeout(resolve, remainingTime)
        );


        // Show an error message to the client
        formMessage.textContent =
            error.message ||
            "Something went wrong. Please try again.";


    } finally {

        // Hide the email animation
        emailAnimation.classList.remove("active");

        // Re-enable the submit button
        submitButton.disabled = false;

        // Restore the original button text
        submitButton.textContent = "Send Message";

    }

});
