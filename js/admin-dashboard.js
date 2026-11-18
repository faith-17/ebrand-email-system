
/* ==========================================
   eBrand Promotion - Admin Dashboard
   Temporary Preview Data
========================================== */

// ==========================================
// 1. Select Dashboard Elements
// ==========================================

const totalEnquiries = document.getElementById("totalEnquiries");

const newEnquiries = document.getElementById("newEnquiries");

const emailsSent = document.getElementById("emailsSent");

const enquiriesTableBody = document.getElementById("enquiriesTableBody");

const emptyState = document.getElementById("emptyState");

const enquirySearch = document.getElementById("enquirySearch");

const emailStatusFilter = document.getElementById("emailStatusFilter");


// ==========================================
// 2. Temporary Sample Enquiries
// ==========================================

// These are fictional records for the design preview.
// Tomorrow, we will replace them with Supabase records.

const enquiries = [

    {
        name: "John Smith",
        email: "john@example.com",
        phone: "08012345678",
        subject: "Website Design",
        message: "I would like to enquire about your website design services.",
        date: "2026-11-17",
        emailStatus: "sent",
        isNew: true
    },

    {
        name: "Mary Johnson",
        email: "mary@example.com",
        phone: "08098765432",
        subject: "Brand Promotion",
        message: "I need assistance promoting my business brand.",
        date: "2026-11-16",
        emailStatus: "sent",
        isNew: false
    },

    {
        name: "David Brown",
        email: "david@example.com",
        phone: "08123456789",
        subject: "Marketing Enquiry",
        message: "I would like to know more about your marketing packages.",
        date: "2026-11-15",
        emailStatus: "failed",
        isNew: false
    }

];


// ==========================================
// 3. Update Dashboard Statistics
// ==========================================

function updateDashboardStats() {

    // Display total number of enquiries
    totalEnquiries.textContent = enquiries.length;

    // Count new enquiries
    const newCount = enquiries.filter(function(enquiry) {
        return enquiry.isNew;
    }).length;

    newEnquiries.textContent = newCount;

    // Count successfully sent emails
    const sentCount = enquiries.filter(function(enquiry) {
        return enquiry.emailStatus === "sent";
    }).length;

    emailsSent.textContent = sentCount;

}


// ==========================================
// 4. Display Enquiries in the Table
// ==========================================

function displayEnquiries(records) {

    // Clear the previous table records
    enquiriesTableBody.innerHTML = "";

    // Show empty message when no records exist
    if (records.length === 0) {

        emptyState.style.display = "block";

        return;

    }

    // Hide empty message when records exist
    emptyState.style.display = "none";

    // Display each enquiry
    records.forEach(function(enquiry, index) {

        // Create a new table row
        const tableRow = document.createElement("tr");

        // Create the email status badge
        const statusBadge = enquiry.emailStatus === "sent"
            ? '<span class="badge bg-success">Sent</span>'
            : '<span class="badge bg-danger">Failed</span>';

        // Add enquiry information to the row
        tableRow.innerHTML = `
            <td>
                <strong>${enquiry.name}</strong><br>
                <small>${enquiry.email}</small>
            </td>

            <td>${enquiry.subject}</td>

            <td>${enquiry.date}</td>

            <td>${statusBadge}</td>

            <td>
                <button
                    type="button"
                    class="btn btn-sm btn-outline-primary view-enquiry"
                    data-index="${index}">
                    View
                </button>
            </td>
        `;

        // Add the row to the table
        enquiriesTableBody.appendChild(tableRow);

    });

}


// ==========================================
// 5. Search and Filter Enquiries
// ==========================================

function filterEnquiries() {

    // Get the search text
    const searchText = enquirySearch.value.toLowerCase();

    // Get the selected email status
    const selectedStatus = emailStatusFilter.value;

    // Filter the enquiries
    const filteredRecords = enquiries.filter(function(enquiry) {

        // Search through client information
        const matchesSearch =
            enquiry.name.toLowerCase().includes(searchText) ||
            enquiry.email.toLowerCase().includes(searchText) ||
            enquiry.subject.toLowerCase().includes(searchText);

        // Check email status
        const matchesStatus =
            selectedStatus === "all" ||
            enquiry.emailStatus === selectedStatus;

        // Return records matching both conditions
        return matchesSearch && matchesStatus;

    });

    // Display the filtered records
    displayEnquiries(filteredRecords);

}


// ==========================================
// 6. View Enquiry Details
// ==========================================

enquiriesTableBody.addEventListener("click", function(event) {

    // Check if the View button was clicked
    const viewButton = event.target.closest(".view-enquiry");

    if (!viewButton) {
        return;
    }

    // Get the selected enquiry
    const selectedIndex = Number(viewButton.dataset.index);

    const enquiry = enquiries.find(function(record) {
        return enquiries.indexOf(record) === selectedIndex;
    });

    // Display the enquiry details
    if (enquiry) {

        alert(
            "CLIENT DETAILS\n\n" +
            "Name: " + enquiry.name + "\n" +
            "Email: " + enquiry.email + "\n" +
            "Phone: " + enquiry.phone + "\n\n" +
            "Subject: " + enquiry.subject + "\n\n" +
            "Message: " + enquiry.message
        );

    }

});


// ==========================================
// 7. Listen for Search and Filter Changes
// ==========================================

enquirySearch.addEventListener("input", filterEnquiries);

emailStatusFilter.addEventListener("change", filterEnquiries);


// ==========================================
// 8. Initialise Dashboard
// ==========================================

// Display the statistics
updateDashboardStats();

// Display all sample enquiries
displayEnquiries(enquiries);
