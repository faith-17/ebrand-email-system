
/* 
   Admin Dashboard
   Connected to Supabase
*/

// Select dashboard elements
const totalEnquiries = document.getElementById("totalEnquiries");
const failedEmails = document.getElementById("failedEmails");
const emailsSent = document.getElementById("emailsSent");

const enquiriesTableBody = document.getElementById("enquiriesTableBody");
const emptyState = document.getElementById("emptyState");
const enquirySearch = document.getElementById("enquirySearch");
const emailStatusFilter = document.getElementById("emailStatusFilter");
const logoutButton = document.getElementById("logoutButton");

// Supabase project details
const SUPABASE_URL = "https://oakpxhjfnhrdnjvxgaxb.supabase.co";
const SUPABASE_KEY = "sb_publishable_t3NH4LkeAzPk0oEdbVJuYQ_WhaC6oLD";

let supabaseClient;
let enquiries = [];



// Load Supabase


const supabaseScript = document.createElement("script");

supabaseScript.src =
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

const supabaseReady = new Promise((resolve, reject) => {

    supabaseScript.onload = function () {

        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

        resolve(supabaseClient);
    };

    supabaseScript.onerror = reject;

});

document.head.appendChild(supabaseScript);



// Protect the Dashboard


async function checkAdminAccess() {

    try {

        await supabaseReady;

        // Check the current login session
        const { data: sessionData } =
            await supabaseClient.auth.getSession();

        if (!sessionData.session) {
            window.location.href = "admin-login.html";
            return false;
        }

        // Verify the logged-in user
        const { data: userData, error: userError } =
            await supabaseClient.auth.getUser();

        if (userError || !userData.user) {
            window.location.href = "admin-login.html";
            return false;
        }

        // Check administrator membership
        const { data: adminRecord, error: adminError } =
            await supabaseClient
                .from("admin_users")
                .select("user_id")
                .eq("user_id", userData.user.id)
                .maybeSingle();

        if (adminError || !adminRecord) {

            await supabaseClient.auth.signOut();

            window.location.href = "admin-login.html";

            return false;
        }

        return true;

    } catch (error) {

        console.error("Admin verification error:", error);

        alert("Unable to verify your login. Please try again.");

        window.location.href = "admin-login.html";

        return false;
    }
}



//Load Real Enquiries


async function loadEnquiries() {

    emptyState.style.display = "block";
    emptyState.querySelector("p").textContent =
        "Loading client enquiries...";

    const { data, error } = await supabaseClient
        .from("enquiries")
        .select(`
            id,
            created_at,
            client_name,
            client_email,
            client_phone,
            subject,
            message,
            photo_path,
            email_status
        `)
        .order("created_at", { ascending: false });

    if (error) {

        console.error("Enquiry loading error:", error);

        emptyState.querySelector("p").textContent =
            "Unable to load enquiries. Please refresh the page.";

        return;
    }

    enquiries = data || [];

    updateDashboardStats();

    filterEnquiries();
}



// Update Dashboard Statistics


function updateDashboardStats() {

    totalEnquiries.textContent = enquiries.length;

    const sentCount = enquiries.filter(function(enquiry) {
        return enquiry.email_status === "sent";
    }).length;

    const failedCount = enquiries.filter(function(enquiry) {
        return enquiry.email_status === "failed";
    }).length;

    emailsSent.textContent = sentCount;

    failedEmails.textContent = failedCount;
}



// Display Enquiries


function displayEnquiries(records) {

    enquiriesTableBody.innerHTML = "";

    if (records.length === 0) {

        emptyState.style.display = "block";

        emptyState.querySelector("p").textContent =
            enquiries.length === 0
                ? "Client enquiries will appear here."
                : "No enquiries match your search.";

        return;
    }

    emptyState.style.display = "none";

    records.forEach(function(enquiry) {

        const tableRow = document.createElement("tr");

        // Client name and email
        const clientCell = document.createElement("td");

        const clientName = document.createElement("strong");
        clientName.textContent = enquiry.client_name || "Not provided";

        const clientEmail = document.createElement("small");
        clientEmail.textContent = enquiry.client_email || "";

        clientCell.append(clientName);
        clientCell.append(document.createElement("br"));
        clientCell.append(clientEmail);

        // Subject
        const subjectCell = document.createElement("td");
        subjectCell.textContent = enquiry.subject || "No subject";

        // Date
        const dateCell = document.createElement("td");

        dateCell.textContent = enquiry.created_at
            ? new Date(enquiry.created_at).toLocaleDateString()
            : "Unknown";

        // Email status
        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        const status = enquiry.email_status || "pending";

        statusBadge.className =
            status === "sent"
                ? "badge bg-success"
                : status === "failed"
                    ? "badge bg-danger"
                    : "badge bg-warning text-dark";

        statusBadge.textContent =
            status.charAt(0).toUpperCase() + status.slice(1);

        statusCell.appendChild(statusBadge);

        // View button
        const actionCell = document.createElement("td");
        const viewButton = document.createElement("button");

        viewButton.type = "button";
        viewButton.className =
            "btn btn-sm btn-outline-primary view-enquiry";

        viewButton.textContent = "View";
        viewButton.dataset.id = enquiry.id;

        actionCell.appendChild(viewButton);

        tableRow.append(
            clientCell,
            subjectCell,
            dateCell,
            statusCell,
            actionCell
        );

        enquiriesTableBody.appendChild(tableRow);
    });
}



//Search and Filter


function filterEnquiries() {

    const searchText = enquirySearch.value.toLowerCase().trim();

    const selectedStatus = emailStatusFilter.value;

    const filteredRecords = enquiries.filter(function(enquiry) {

        const matchesSearch =
            (enquiry.client_name || "").toLowerCase().includes(searchText) ||
            (enquiry.client_email || "").toLowerCase().includes(searchText) ||
            (enquiry.subject || "").toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "all" ||
            enquiry.email_status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    displayEnquiries(filteredRecords);
}

enquirySearch.addEventListener("input", filterEnquiries);

emailStatusFilter.addEventListener("change", filterEnquiries);



// Create Enquiry Details Window


function createDetailsDialog() {

    const dialog = document.createElement("dialog");

    dialog.style.cssText = `
        width: 90%;
        max-width: 650px;
        max-height: 85vh;
        overflow-y: auto;
        border: none;
        border-radius: 12px;
        padding: 25px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    `;

    const heading = document.createElement("h2");
    heading.textContent = "Client Enquiry Details";

    const content = document.createElement("div");
    content.id = "enquiryDetailsContent";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.textContent = "Close";
    closeButton.className = "btn btn-secondary mt-3";

    closeButton.addEventListener("click", function() {
        dialog.close();
    });

    dialog.append(heading, content, closeButton);

    document.body.appendChild(dialog);

    return { dialog, content };
}

const detailsWindow = createDetailsDialog();



// View Full Enquiry Details


async function viewEnquiry(enquiry) {

    const content = detailsWindow.content;

    content.innerHTML = "";

    function addDetail(label, value) {

        const wrapper = document.createElement("div");
        wrapper.className = "mb-3";

        const heading = document.createElement("strong");
        heading.textContent = label;

        const paragraph = document.createElement("p");
        paragraph.textContent = value || "Not provided";

        wrapper.append(heading, paragraph);
        content.appendChild(wrapper);
    }

    addDetail("Client Name", enquiry.client_name);
    addDetail("Email Address", enquiry.client_email);
    addDetail("Phone Number", enquiry.client_phone);
    addDetail("Subject", enquiry.subject);
    addDetail("Description", enquiry.message);
    addDetail("Email Status", enquiry.email_status);

    addDetail(
        "Date Submitted",
        enquiry.created_at
            ? new Date(enquiry.created_at).toLocaleString()
            : "Unknown"
    );

    if (enquiry.photo_path) {

        addDetail("Client Photo", "");

        const photoMessage = document.createElement("p");
        photoMessage.textContent = "Loading photo...";

        content.appendChild(photoMessage);

        // Generate a temporary private photo link
        const { data, error } = await supabaseClient.storage
            .from("client-photos")
            .createSignedUrl(enquiry.photo_path, 300);

        if (error || !data?.signedUrl) {

            photoMessage.textContent =
                "Photo unavailable. Storage permissions may need configuration.";

        } else {

            photoMessage.remove();

            const photo = document.createElement("img");

            photo.src = data.signedUrl;
            photo.alt = "Client uploaded photo";

            photo.style.cssText = `
                display: block;
                max-width: 100%;
                max-height: 350px;
                object-fit: contain;
                border-radius: 8px;
                margin-top: 10px;
            `;

            content.appendChild(photo);
        }

    } else {

        addDetail("Client Photo", "No photo uploaded");
    }

    if (!detailsWindow.dialog.open) {
        detailsWindow.dialog.showModal();
    }
}



// Handle View Button


enquiriesTableBody.addEventListener("click", async function(event) {

    const viewButton = event.target.closest(".view-enquiry");

    if (!viewButton) return;

    const enquiry = enquiries.find(function(record) {
        return record.id === viewButton.dataset.id;
    });

    if (enquiry) {
        await viewEnquiry(enquiry);
    }
});



// Logout


logoutButton.addEventListener("click", async function() {

    logoutButton.disabled = true;
    logoutButton.textContent = "Logging out...";

    const { error } = await supabaseClient.auth.signOut();

    if (error) {

        alert("Unable to log out. Please try again.");

        logoutButton.disabled = false;
        logoutButton.textContent = "Logout";

        return;
    }

    window.location.href = "admin-login.html";
});



//Start Dashboard


async function initialiseDashboard() {

    const authorised = await checkAdminAccess();

    if (!authorised) return;

    await loadEnquiries();
}

initialiseDashboard();
