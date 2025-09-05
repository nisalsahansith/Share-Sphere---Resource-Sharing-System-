$(document).ready(function () {
    const userId = localStorage.getItem("userId");

    // Fetch skills
    $.ajax({
        url: "http://localhost:8080/mylistings/getmyskills",
        type: "GET",
        data: { userId: userId },
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
        success: function (response) {
            if (response.data && Array.isArray(response.data)) {
                let listingsHtml = "";

                response.data.forEach((skill, index) => {
                    let carouselItems = "";
                    if (skill.imageUrls && skill.imageUrls.length > 0) {
                        skill.imageUrls.forEach((url, imgIndex) => {
                            carouselItems += `
                                <div class="carousel-item ${imgIndex === 0 ? "active" : ""}">
                                    <img src="${url}" class="d-block w-100" alt="Listing Image">
                                </div>
                            `;
                        });
                    } else {
                        carouselItems = `
                            <div class="carousel-item active">
                                <img src="https://via.placeholder.com/150" class="d-block w-100" alt="Listing Image">
                            </div>
                        `;
                    }

                    listingsHtml += `
                    <div class="col-md-4">
                        <div class="card listing-card shadow-sm border-0">
                            <div id="carousel${index}" class="carousel slide" data-bs-ride="carousel">
                                <div class="carousel-inner">${carouselItems}</div>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title fw-bold">${skill.name}</h5>
                                <p class="text-muted mb-1">${skill.availability}</p>
                                <p><span class="badge bg-info">${skill.startDate || ''} → ${skill.endDate || ''}</span></p>

                                <!-- Request Button -->
                                <button id="requestBtn-${skill.skillId}"
                                        class="btn btn-outline-primary w-100 position-relative received-requests-btn"
                                        data-skill-id="${skill.skillId}">
                                    <i class="bi bi-envelope-open"></i> View Requests 
                                    <span class="badge bg-secondary ms-2">0</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    `;

                    fetchSkillRequests(skill.skillId);
                });

                $("#listingsContainer").html(listingsHtml);
            }
        }
    });

    // Fetch requests for each skill and store them in button
    function fetchSkillRequests(skillId) {
        $.ajax({
            url: "http://localhost:8080/mylistings/getskillrequests",
            type: "GET",
            data: { skillId: skillId },
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
            success: function (reqResponse) {
                let requests = reqResponse.data || [];
                let totalRequests = requests.length;
                let newRequests = requests.filter(r => r.status === "PENDING").length;

                let btn = $(`#requestBtn-${skillId}`);
                btn.find(".badge.bg-secondary").text(totalRequests);

                btn.find(".badge.bg-danger").remove();
                if (newRequests > 0) {
                    btn.append(`
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            ${newRequests}
                        </span>
                    `);
                }

                // Store requests in button for later use
                btn.data("requests", requests);
            }
        });
    }

    // When user clicks the button -> open modal with request details
    $(document).on("click", ".received-requests-btn", function () {
        let requests = $(this).data("requests") || [];
        let container = $("#skillRequestsContainer");
        container.empty();

        if (requests.length > 0) {
            requests.forEach(r => {
                let statusBadge = r.status === "PENDING"
                    ? `<span class="badge bg-warning">Pending</span>`
                    : `<span class="badge bg-success">${r.status}</span>`;

                container.append(`
                <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-start request-card"
                    data-request='${JSON.stringify(r)}'>
                    <div>
                        <h6 class="mb-1"><i class="bi bi-person-circle"></i> Requester: ${r.requesterId}</h6>
                        <p class="mb-1"><i class="bi bi-chat-dots"></i> ${r.message || "No message"}</p>
                        <small><i class="bi bi-calendar"></i> ${r.requestedDates || "-"}</small>
                    </div>
                    <div class="text-end">
                        <p class="mb-1 fw-bold">$${r.price || "-"}</p>
                        ${getStatusBadge(r.status)}
                    </div>
                </div>
            `);
            });
        } else {
            container.html(`<p class="text-muted text-center">No requests found for this skill.</p>`);
        }

        $("#skillRequestsModal").modal("show");
    });
});
$(document).ready(function () {
    const userId = localStorage.getItem("userId");

    // 1. Fetch tools
    $.ajax({
        url: "http://localhost:8080/mylistings/getmytools",
        type: "GET",
        data: { userId: userId },
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
        success: function (response) {
            if (response.data && Array.isArray(response.data)) {
                let toolsHtml = "";

                response.data.forEach((tool, index) => {
                    let carouselItems = "";
                    if (tool.imageUrls && tool.imageUrls.length > 0) {
                        tool.imageUrls.forEach((url, imgIndex) => {
                            carouselItems += `
                                <div class="carousel-item ${imgIndex === 0 ? "active" : ""}">
                                    <img src="${url}" class="d-block w-100" alt="Tool Image">
                                </div>
                            `;
                        });
                    } else {
                        carouselItems = `
                            <div class="carousel-item active">
                                <img src="https://via.placeholder.com/150" class="d-block w-100" alt="Tool Image">
                            </div>
                        `;
                    }

                    toolsHtml += `
                    <div class="col-md-4">
                        <div class="card listing-card shadow-sm border-0">
                            <div id="toolCarousel${index}" class="carousel slide" data-bs-ride="carousel">
                                <div class="carousel-inner">
                                    ${carouselItems}
                                </div>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title fw-bold">${tool.name}</h5>
                                <p class="text-muted mb-1">${tool.condition}</p>
                                <p><span class="badge bg-success">${tool.startDate || ''} → ${tool.endDate || ''}</span></p>

                                <!-- Request Button -->
                                <button id="toolRequestBtn-${tool.toolId}"
                                        class="btn btn-outline-primary w-100 position-relative tool-requests-btn"
                                        data-tool-id="${tool.toolId}">
                                    <i class="bi bi-envelope-open"></i> View Requests 
                                    <span class="badge bg-secondary ms-2">0</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    `;

                    // Fetch requests for this tool
                    fetchToolRequests(tool.toolId);
                });

                $("#toolsContainer").html(toolsHtml);
            } else {
                $("#toolsContainer").html("<p>No tools found.</p>");
            }
        },
        error: function (err) {
            console.error(err);
            $("#toolsContainer").html("<p>Error loading tools.</p>");
        }
    });

    // 2. Fetch requests for a tool
    function fetchToolRequests(toolId) {
        $.ajax({
            url: "http://localhost:8080/mylistings/gettoolrequests",
            type: "GET",
            data: { toolId: toolId },
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
            success: function (reqResponse) {
                let requests = reqResponse.data || [];
                let totalRequests = requests.length;
                let newRequests = requests.filter(r => r.status === "PENDING").length;

                let btn = $(`#toolRequestBtn-${toolId}`);
                btn.find(".badge.bg-secondary").text(totalRequests);

                btn.find(".badge.bg-danger").remove();
                if (newRequests > 0) {
                    btn.append(`
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            ${newRequests}
                        </span>
                    `);
                }

                // Store requests in button
                btn.data("requests", requests);
            },
            error: function (err) {
                console.error("Error loading requests for toolId:", toolId, err);
            }
        });
    }

    // 3. When request button clicked -> open modal
    $(document).on("click", ".tool-requests-btn", function () {
        let requests = $(this).data("requests") || [];
        let container = $("#toolRequestsContainer");
        container.empty();

        if (requests.length > 0) {
            requests.forEach(r => {
                let statusBadge = r.status === "PENDING"
                    ? `<span class="badge bg-warning">Pending</span>`
                    : `<span class="badge bg-success">${r.status}</span>`;

                container.append(`
                        <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-start request-card"
                            data-request='${JSON.stringify(r)}'>
                            <div>
                                <h6 class="mb-1"><i class="bi bi-person-circle"></i> Requester: ${r.requesterId}</h6>
                                <p class="mb-1"><i class="bi bi-chat-dots"></i> ${r.message || "No message"}</p>
                                <small><i class="bi bi-calendar"></i> ${r.requestedDates || r.borrowStartDate?.split("T")[0] + " → " + r.borrowEndDate?.split("T")[0] || "-"}</small>
                            </div>
                            <div class="text-end">
                                <p class="mb-1 fw-bold">$${r.price || "-"}</p>
                                ${getStatusBadge(r.status)}
                            </div>
                        </div>
                    `);

            });
        } else {
            container.html(`<p class="text-muted text-center">No requests found for this tool.</p>`);
        }

        $("#toolRequestsModal").modal("show");
    });
});


// Click handler for request card
$(document).on("click", ".request-card", function() {
    const requestData = $(this).data("request"); // JSON object stored in data-request
    const userId = requestData.requesterId;
    console.log("Request Data:", requestData);

    // Fetch user profile via AJAX
    $.ajax({
        url: `http://localhost:8080/mylistings/getuserdetails`,
        type: "GET",
        data: { userId: userId },
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
        success: function (user) {
            console.log("User Data:", user);
            $("#requesterImage").attr("src", user.data.userImage || "https://thvnext.bing.com/th/id/OIP.1gkxdleEjreaeUbLYpyC4QHaHa?o=7&cb=ucfimg2rm=3&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3");
            $("#requesterName").text(user.data.firstName + " " + user.data.lastName);
            $("#requesterEmail").text(user.data.user.email || "");

            // Fill request details
            $("#requestType").text(requestData.skillId ? "Skill" : "Tool");
            $("#requestMessage").text(requestData.message || "No message");
            if(requestData.borrowStartDate && requestData.borrowEndDate){
                $("#requestDates").text(requestData.borrowStartDate.split("T")[0] + " → " + requestData.borrowEndDate.split("T")[0]);
            } else {
                $("#requestDates").text(requestData.requestedDates || "-");
            }
            $("#requestPrice").text(requestData.price || "-");
            $("#requestStatus").text(requestData.status).removeClass("bg-secondary bg-success bg-warning bg-danger");

            // Add badge color based on status
            let statusClass = "bg-secondary";
            if(requestData.status === "PENDING") statusClass = "bg-warning";
            else if(requestData.status === "ACCEPTED") statusClass = "bg-success";
            else if (requestData.status === "REJECTED") statusClass = "bg-danger";
            else if (requestData.status === "MAYBE_LATER") statusClass = "bg-info";
            $("#requestStatus").addClass(statusClass);

            // Store requestId for buttons
            $("#acceptRequestBtn").data("request-id", requestData.skillRequestId || requestData.toolRequestId);
            $("#rejectRequestBtn").data("request-id", requestData.skillRequestId || requestData.toolRequestId);
            $("#maybeLaterBtn").data("request-id", requestData.skillRequestId || requestData.toolRequestId);

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById("requestDetailsModal"));
            modal.show();
        },
        error: function(err){
            console.error("Failed to fetch user profile", err);
        }
    });
});

// Accept / Reject buttons
// $("#acceptRequestBtn, #rejectRequestBtn").click(function(){
//     const status = $(this).attr("id") === "acceptRequestBtn" ? "ACCEPTED" : "REJECTED";
//     const requestId = $(this).data("request-id");

//     $.ajax({
//         url: `http://localhost:8080/mylistings/updaterequeststatus`,
//         type: "POST",
//         data: { requestId: requestId, status: status },
//         headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
//         success: function(res){
//             alert("Request status updated!");
//             location.reload(); // Or refresh only request list for better UX
//         },
//         error: function(err){
//             console.error("Failed to update status", err);
//         }
//     });
// });

function getStatusBadge(status) {
    let badgeClass = "bg-secondary"; // default

    switch (status) {
        case "PENDING":
            badgeClass = "bg-warning"; // yellow
            break;
        case "ACCEPTED":
            badgeClass = "bg-success"; // green
            break;
        case "REJECTED":
            badgeClass = "bg-danger"; // red
            break;
        case "MAYBE_LATER":
            badgeClass = "bg-info"; // blue
            break;
    }

    return `<span class="badge ${badgeClass}">${status.replace("_", " ")}</span>`;
}


// Click handler for Accept / Reject / Maybe Later
$("#acceptRequestBtn, #rejectRequestBtn, #maybeLaterBtn").click(function() {
    const btnId = $(this).attr("id");
    let status = "";

    if (btnId === "acceptRequestBtn") status = "ACCEPTED";
    else if (btnId === "rejectRequestBtn") status = "REJECTED";
    else if (btnId === "maybeLaterBtn") status = "MAYBE_LATER";

    const requestId = $(this).data("request-id");
    const requestType = $("#requestType").text().toUpperCase(); // "SKILL" or "TOOL"
    const requestData = $(".request-card").data("request"); // saved earlier
    console.log(requestType)

    Swal.fire({
        title: `Are you sure?`,
        text: `You are about to mark this request as ${status.replace("_", " ")}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, proceed!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            const formData = new FormData();
            formData.append("skillRequestId", requestId);
            formData.append("toolRequestId", requestId);

            formData.append("status", status);
            formData.append("type", requestType); // must be SKILL/TOOL
            formData.append("receiver", requestData.requesterId);
            formData.append("giver", localStorage.getItem("userId"));
            formData.append("startTime", requestData.borrowStartDate)
            formData.append("endTime", requestData.borrowEndDate)

            for (let [key, value] of formData.entries()) {
                console.log(key + ":", value);
            }

            const url = requestType === "SKILL"
                ? "http://localhost:8080/mylistings/updateskillstatus"
                : "http://localhost:8080/mylistings/updatetoolstatus";

            $.ajax({
                url: url,
                type: "PUT",
                data: formData,
                processData: false,
                contentType: false,
                headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
                success: function(res) {
                    Swal.fire('Updated!', `Request status updated to ${status.replace("_", " ")}`, 'success');
                    $("#requestDetailsModal").modal("hide");
                    // 🔄 Instead of reload, refresh request list
                    // fetchSkillRequests(requestData.skillId || requestData.toolId);
                    location.reload();
                },
                error: function(err) {
                    console.error("Failed to update status", err);
                    Swal.fire('Error!', 'Failed to update request status.', 'error');
                }
            });
        }
    });
});
