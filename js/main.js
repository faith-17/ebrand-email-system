// selecting contact form
const contactForm = document.getElementById("contactForm");

//selecting feedback
const formMessage = document.getElementById("formMessage");

//select email animation
const emailAnimation = document.getElementById("emailAnimation");

//selecting submit button
const submitButton = contactForm.querySelector(`button[type="submit"]`);

//listen for form submission
contactForm.addEventListener("submit", function(event){
    //prevent page from refreshing
    event.preventDefault();

    //clear previous feedback
    formMessage.textContent = "";

    //show the email animation
    emailAnimation.classList.add("active");

    //disable the submit button
    submitButton.disabled = true;

    //change button text
    submitButton.textContent = "sending...";
    //keeping animation visible for at least 3sec
    setTimeout(function() {
        //hide the animation
        emailAnimation.classList.remove("active");

        //show test feedback
        formMessage.textContent =
        "Animation test complete! backend connection cpmes next.";

        //enable the button again
        submitButton.disabled = false;

        //restore button text
        submitButton.textContent = "send Message";

    }, 5000);
});




