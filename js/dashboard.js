/*
 * Assignment: Group Project - E-commerce Website
 * File: dashboard.js
 * Description: Dashboard Analytics - User Frequency and Invoice Management
 *
 * Group Members:
 * - Dimetri Lee (2404379) - dimetrialee@students.utech.edu.jm
 *
 * Module: CIT2011 - Web Programming
 * Class: Thursday 6:00PM
 */

// =================================================================
// Question 6a. ShowUserFrequency() - Show user frequency based on Gender and Age Group
// Created by: Dimetri Lee (2404379)
// Description: Displays bar charts showing distribution of users by gender and age groups
// =================================================================
function ShowUserFrequency() {
  // 1. Get Data from localStorage
  const registrationData =
    JSON.parse(localStorage.getItem("RegistrationData")) || [];

  if (registrationData.length === 0) {
    document.getElementById("genderChart").innerHTML =
      "<p>No registered users found for analysis.</p>";
    document.getElementById("ageChart").innerHTML = "";
    return;
  }

  // Initialize counts
  const genderCounts = {};
  const ageCounts = {
    "18-25": 0,
    "26-35": 0,
    "36-50": 0,
    "50+": 0,
  };
  let maxCount = 0;

  // 2. Process Data - Count users by gender and age group
  registrationData.forEach((user) => {
    // Gender Count (case-insensitive)
    const gender = user.gender ? user.gender.toLowerCase() : "other";
    genderCounts[gender] = (genderCounts[gender] || 0) + 1;

    // Age Group Count
    const age = calculateAge(user.dateOfBirth || user.dob);

    if (age >= 18 && age <= 25) {
      ageCounts["18-25"]++;
    } else if (age >= 26 && age <= 35) {
      ageCounts["26-35"]++;
    } else if (age >= 36 && age <= 50) {
      ageCounts["36-50"]++;
    } else if (age > 50) {
      ageCounts["50+"]++;
    }
  });

  // 3. Find max count for normalization
  maxCount = Math.max(
    ...Object.values(genderCounts),
    ...Object.values(ageCounts)
  );
  if (maxCount === 0) maxCount = 1;

  // 4. Render Charts
  renderChart("genderChart", genderCounts, maxCount, "Gender");
  renderChart("ageChart", ageCounts, maxCount, "Age Group");

  /**
   * Helper function to calculate age from DOB
   * Created by: Dimetri Lee (2404379)
   */
  function calculateAge(dob) {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * Helper function to dynamically render a bar chart using HTML/CSS
   * Created by: Dimetri Lee (2404379)
   */
  function renderChart(elementId, counts, max, title) {
    const container = document.getElementById(elementId);
    let html = "";

    for (const [key, count] of Object.entries(counts)) {
      const percentage = (count / max) * 100;
      const label = key.charAt(0).toUpperCase() + key.slice(1);

      html += `
        <div class="bar-wrapper" role="listitem" aria-label="${label}: ${count} users">
          <span class="bar-label">${label}:</span>
          <div class="bar" style="width: ${percentage * 0.8}%;"></div> 
          <span>${count}</span>
        </div>
      `;
    }
    container.innerHTML = html;
  }
}

// =================================================================
// Question 6b. ShowInvoices() - Display all invoices and search by TRN
// Created by: Dimetri Lee (2404379)
// Description: Displays all invoices from AllInvoices localStorage, with optional TRN search
// Results are logged to console as per assignment requirements
// =================================================================
function ShowInvoices(searchTrn = null) {
  const allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];

  console.log("=====================================");
  console.log("6b. ShowInvoices() - All Invoices Data");
  console.log("=====================================");

  if (allInvoices.length === 0) {
    console.log("No invoices found in AllInvoices localStorage.");
    return;
  }

  let results = allInvoices;
  let message = `Total Invoices Found: ${allInvoices.length}`;

  // If TRN provided, filter results
  if (searchTrn && searchTrn.trim() !== "") {
    const trn = searchTrn.trim();
    results = allInvoices.filter((invoice) => invoice.userTRN === trn);
    message = `Invoices for TRN ${trn}: ${results.length} found.`;
  }

  console.log(message);

  if (results.length > 0) {
    console.table(
      results.map((inv) => ({
        "Invoice #": inv.invoiceNumber,
        Date: inv.date,
        TRN: inv.userTRN,
        Total: `$${inv.total.toFixed(2)}`,
        Name: inv.shippingInfo.fullName,
      }))
    );
  } else {
    console.log(
      `No invoices found matching the search criteria (TRN: ${searchTrn}).`
    );
  }
}

// =================================================================
// Question 6c. GetUserInvoices() - Display invoices for specific user by TRN
// Created by: Dimetri Lee (2404379)
// Description: Retrieves and displays all invoices for a user from their RegistrationData
// Results are logged to console as per assignment requirements
// =================================================================
function GetUserInvoices(trn) {
  console.log("=====================================");
  console.log("6c. GetUserInvoices() - User Invoice History");
  console.log("=====================================");

  const registrationData =
    JSON.parse(localStorage.getItem("RegistrationData")) || [];
  const user = registrationData.find((u) => u.trn === trn);

  if (!user) {
    console.log(`Error: User with TRN ${trn} not found in RegistrationData.`);
    return;
  }

  const userInvoices = user.invoices || [];

  console.log(`User: ${user.firstName} ${user.lastName} (TRN: ${trn})`);
  console.log(`Total Invoices for this User: ${userInvoices.length}`);

  if (userInvoices.length > 0) {
    console.table(
      userInvoices.map((inv) => ({
        "Invoice #": inv.invoiceNumber,
        Date: inv.date,
        Subtotal: `$${inv.subtotal.toFixed(2)}`,
        Total: `$${inv.total.toFixed(2)}`,
      }))
    );
  } else {
    console.log(
      `This user has no invoices recorded in their RegistrationData profile.`
    );
  }
}

// =================================================================
// Dashboard Initialization
// Created by: Dimetri Lee (2404379)
// Description: Initialize dashboard when page loads
// =================================================================
document.addEventListener("DOMContentLoaded", function () {
  // Run frequency analysis immediately
  ShowUserFrequency();

  // Setup listener for GetUserInvoices form
  const getUserInvoicesForm = document.getElementById("getUserInvoicesForm");
  if (getUserInvoicesForm) {
    getUserInvoicesForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const trn = document.getElementById("userTrnInput").value;
      GetUserInvoices(trn);
      alert(`Results for TRN ${trn} logged to console (F12).`);
    });
  }

  // Setup listener for ShowInvoices form
  const showInvoicesForm = document.getElementById("showInvoicesForm");
  if (showInvoicesForm) {
    showInvoicesForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const trn = document.getElementById("allInvoicesTrnInput").value;
      ShowInvoices(trn);
      const message = trn
        ? `Search results for TRN ${trn} logged to console (F12).`
        : "All invoices logged to console (F12).";
      alert(message);
    });
  }

  console.log(
    "Dashboard Loaded. Use the search forms to execute invoice retrieval functions."
  );
});
