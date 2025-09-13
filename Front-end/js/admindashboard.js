$(document).ready(function () {
    // ================================
    // Mobile menu toggle
    // ================================
    $("#mobileMenuToggle").on("click", function () {
        $("#sidebar").toggleClass("active");
    });

    // Sidebar navigation (redirect to page)
    $(".nav-link[data-page]").on("click", function (e) {
        e.preventDefault();
        const targetPage = $(this).data("page");
        window.location.href = targetPage; // go to another HTML page
    });

    // ================================
    // Form submissions (only for settings page)
    // ================================
    $("#generalSettingsForm").on("submit", function (e) {
        e.preventDefault();
        showNotification("Settings saved successfully!", "success");
    });

    $("#notificationSettingsForm").on("submit", function (e) {
        e.preventDefault();
        showNotification("Notification settings updated!", "success");
    });

    $("#securitySettingsForm").on("submit", function (e) {
        e.preventDefault();
        showNotification("Security settings updated!", "success");
    });

    // ================================
    // Stat cards hover effects
    // ================================
    $(".stat-card").hover(
        function () {
            $(this).css("transform", "translateY(-8px) scale(1.02)");
        },
        function () {
            $(this).css("transform", "translateY(0) scale(1)");
        }
    );

    // Button click effects
    $(".btn-action, .quick-action-btn").on("click", function () {
        const $btn = $(this);
        $btn.css("transform", "scale(0.95)");
        setTimeout(() => {
            $btn.css("transform", "scale(1)");
        }, 150);
    });

    // ================================
    // Logout
    // ================================
    $(document).on("click", ".logout-btn", function () {
        localStorage.removeItem("token");
        window.location.href = "/index.html"; // adjust login page path if needed
    });
});

// ================================
// Utility function
// ================================
function showNotification(message, type = "info") {
    Swal.fire({
        icon: type,
        title: message,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end"
    });
}

    // Show dashboard by default
    $("#dashboard").show().css({ opacity: "1", transform: "translateY(0)" });

    // ================================
    // Initialize charts
    // ================================
    initializeCharts();

    // ================================
    // Form submissions
    // ================================
    $("#generalSettingsForm").on("submit", function (e) {
        e.preventDefault();
        showNotification("Settings saved successfully!", "success");
    });

    $("#notificationSettingsForm").on("submit", function (e) {
        e.preventDefault();
        showNotification("Notification settings updated!", "success");
    });

    $("#securitySettingsForm").on("submit", function (e) {
        e.preventDefault();
        showNotification("Security settings updated!", "success");
    });

    // ================================
    // Stat cards hover effects
    // ================================
    $(".stat-card").hover(
        function () {
            $(this).css("transform", "translateY(-8px) scale(1.02)");
        },
        function () {
            $(this).css("transform", "translateY(0) scale(1)");
        }
    );

    // Button click effects
    $(".btn-action, .quick-action-btn").on("click", function () {
        const $btn = $(this);
        $btn.css("transform", "scale(0.95)");
        setTimeout(() => {
            $btn.css("transform", "scale(1)");
        }, 150);
    });

    // Search functionality
    $(".search-input").on("input", function () {
        console.log("Searching for:", $(this).val());
    });

    // ================================
    // User management actions
    // ================================
    
    // ================================
    // User search filter
    // ================================
    

    // ================================
    // Logout
    // ================================
    $(document).on("click", ".logout-btn", function () {
        localStorage.removeItem("token");
        window.location.href = "/index.html"; // adjust login page path if needed
    });

    // Animate dashboard stats
    // setTimeout(() => {
    //     animateNumber($("#totalUsers")[0], 0, 1247, 2000);
    //     animateNumber($("#activeListings")[0], 0, 856, 2000);
    //     animateNumber($("#pendingListings")[0], 0, 23, 2000);
    //     animateNumber($("#totalTransactions")[0], 0, 1892, 2000);
    // }, 500);
// });

// ================================
// Charts
// ================================
function initializeCharts() {
    const ctxCategory = document.getElementById("categoryChart");
    if (ctxCategory) {
        new Chart(ctxCategory, {
            type: "doughnut",
            data: {
                labels: ["Tools & Equipment", "Skills & Services", "Electronics", "Sports & Outdoors", "Others"],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe"],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { color: "white", padding: 20 }
                    }
                }
            }
        });
    }

    const ctxTransaction = document.getElementById("transactionChart");
    if (ctxTransaction) {
        new Chart(ctxTransaction, {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
                datasets: [{
                    label: "Transactions",
                    data: [65, 85, 120, 95, 140, 180, 160, 200],
                    borderColor: "#667eea",
                    backgroundColor: "rgba(102, 126, 234, 0.1)",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: "white" } }
                },
                scales: {
                    x: { ticks: { color: "white" }, grid: { color: "rgba(255,255,255,0.1)" } },
                    y: { ticks: { color: "white" }, grid: { color: "rgba(255,255,255,0.1)" } }
                }
            }
        });
    }

    const ctxUserEngagement = document.getElementById("userEngagementChart");
    if (ctxUserEngagement) {
        new Chart(ctxUserEngagement, {
            type: "bar",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [{
                    label: "Active Users",
                    data: [320, 280, 350, 410, 390, 250, 180],
                    backgroundColor: "#4facfe",
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: "white" } } },
                scales: {
                    x: { ticks: { color: "white" }, grid: { color: "rgba(255,255,255,0.1)" } },
                    y: { ticks: { color: "white" }, grid: { color: "rgba(255,255,255,0.1)" } }
                }
            }
        });
    }

    const ctxDevice = document.getElementById("deviceChart");
    if (ctxDevice) {
        new Chart(ctxDevice, {
            type: "pie",
            data: {
                labels: ["Mobile", "Desktop", "Tablet"],
                datasets: [{
                    data: [60, 35, 5],
                    backgroundColor: ["#f5576c", "#667eea", "#4facfe"]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: "bottom", labels: { color: "white", padding: 15 } }
                }
            }
        });
    }
}

// ================================
// Utility functions
// ================================
function showNotification(message, type = "info") {
    Swal.fire({
        icon: type,
        title: message,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end"
    });
}

// function animateNumber(element, start, end, duration) {
//     if (!element) {
//         console.error("animateNumber: element not found");
//         return;
//     }

//     const range = end - start;
//     const increment = range / (duration / 16);
//     let current = start;

//     const timer = setInterval(() => {
//         current += increment;
//         element.textContent = Math.floor(current).toLocaleString();

//         if (current >= end) {
//             element.textContent = end.toLocaleString();
//             clearInterval(timer);
//         }
//     }, 16);
// }




