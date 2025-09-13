$("#usersTable").on("click", ".btn-delete", function () {
    const userId = $(this).closest("tr").data("userid");
    console.log("Delete userId:", userId);

    const row = $(this).closest("tr");

    Swal.fire({
        title: "Are you sure?",
        text: "This user account will be permanently deleted!",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Yes, delete!",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `http://localhost:8080/admin/usercontroller/userdeleet?userId=${userId}`,
                type: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                success: function (response) {
                    Swal.fire("Deleted!", "User deleted successfully!", "success");

                    // Remove row from table
                    row.fadeOut(500, function () { $(this).remove(); });
                },
                error: function (xhr) {
                    Swal.fire("Error", "Could not delete user.", "error");
                }
            });
        }
    });
});


$("#userSearch").on("input", function () {
        const searchValue = $(this).val().toLowerCase();
        $("#usersTable tr").each(function () {
            const name = $(this).children().eq(1).text().toLowerCase();
            const email = $(this).children().eq(2).text().toLowerCase();
            $(this).toggle(name.includes(searchValue) || email.includes(searchValue));
        });
    });

    // Event listener for Block button
    $("#usersTable").on("click", ".btn-block", function () {
        const userId = $(this).closest("tr").data("userid"); // ✅ now works
        console.log(userId)

        const button = $(this); // Reference to clicked button

        Swal.fire({
            title: "Are you sure?",
            text: "This user will be blocked!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, block!",
            cancelButtonText: "Cancel",
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `http://localhost:8080/admin/usercontroller/userblock?userId=${userId}`, // your backend URL
                type: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token") // if using JWT
                },
                success: function (response) {
                    // Update button UI
                    button.removeClass("btn-block btn-danger").addClass("btn-unblock btn-success");
                    button.html('<i class="fas fa-unlock"></i>');

                    Swal.fire("Blocked!", "User has been blocked!", "success");

                    // Optionally update status badge
                     button.removeClass("btn-block").addClass("btn-unblock").html('<i class="fas fa-unlock"></i>');
                    button.closest("tr").find("td:nth-child(5)") // Status column
                        .html('<span class="badge badge-inactive">Blocked</span>');
                },
                error: function (xhr, status, error) {
                    Swal.fire("Error!", "Failed to block user: " + xhr.responseJSON.message, "error");
                }
            });
        }
    });
});


    $("#usersTable").on("click", ".btn-unblock", function () {
    const userId = $(this).closest("tr").data("userid");
    console.log("Unblock userId:", userId);

    const button = $(this);

    Swal.fire({
        title: "Are you sure?",
        text: "This user will be unblocked!",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, unblock!",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `http://localhost:8080/admin/usercontroller/userunblock?userId=${userId}`,
                type: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                success: function (response) {
                    Swal.fire("Unblocked!", "User has been unblocked.", "success");

                    // Update UI
                    button.removeClass("btn-unblock").addClass("btn-block").html('<i class="fas fa-ban"></i>');
                    button.closest("tr").find("td:nth-child(5)") // status column
                        .html('<span class="badge badge-active">Active</span>');
                },
                error: function (xhr) {
                    Swal.fire("Error", "Could not unblock user.", "error");
                }
            });
        }
    });
});


    $("#usersTable").on("click", ".btn-edit", function () {
        Swal.fire("Updated!", "User role updated!", "info");
        // TODO: call backend API: PATCH /admin/users/{id}/role
    });

        // Highlight active nav link
        document.addEventListener("DOMContentLoaded", function () {
            const currentPath = window.location.pathname;
            document.querySelectorAll(".nav-link").forEach(link => {
                if (link.getAttribute("href") === currentPath) {
                    link.classList.add("active");
                }
            });

            // Simple user search
            $('#userSearch').on('keyup', function () {
                const value = $(this).val().toLowerCase();
                $('#usersTable tr').filter(function () {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
            });
        });

        $(document).ready(function () {
    const token = localStorage.getItem("token");

    // Load Users
    function loadUsers() {
        $.ajax({
            url: "http://localhost:8080/admin/usercontroller/getusers",
            type: "GET",
            headers: { "Authorization": "Bearer " + token },
            success: function (response) {
                const users = response.data; // adjust if wrapped in response.data
                const $table = $("#usersTable");
                $table.empty();
                let count = 1
                users.forEach(user => {
                    let fullName = user.firstName + " " + user.lastName;
                    if (fullName === "null null") {
                        fullName = "NO"
                    }
                    const statusBadge = user.user.status === "ACTIVE"
                        ? '<span class="badge-modern badge-active">Active</span>'
                        : '<span class="badge-modern badge-pending">Blocked</span>';

                    const actionButtons = `
                        <button class="btn-action btn-view" data-user='${JSON.stringify(user)}'>
                            <i class="fas fa-eye"></i>
                        </button>
                        ${user.user.status === "ACTIVE"
                            ? `<button class="btn-action btn-block"><i class="fas fa-ban"></i></button>`
                            : `<button class="btn-action btn-unblock"><i class="fas fa-unlock"></i></button>`}
                        <button class="btn-action btn-delete"><i class="fas fa-trash"></i></button>
                    `;
                
                    $table.append(`
                        <tr data-userid="${user.user.id}">
                            <td >${count++}</td>
                            <td><img src="${user.userImage || "https://thvnext.bing.com/th/id/OIP.1gkxdleEjreaeUbLYpyC4QHaHa?o=7&cb=ucfimg2rm=3&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"}" class="rounded-circle" width="40" height="40"></td>
                            <td>${fullName}</td>
                            <td>${user.user.email}</td>
                            <td>${statusBadge}</td>
                            <td>${user.user.role}</td>
                            <td>${actionButtons}</td>
                        </tr>
                    `);
                });
            },
            error: function () {
                Swal.fire("Error", "Failed to load users", "error");
            }
        });
    }

    // Show user details in modal
    $(document).on("click", ".btn-view", function () {
        const user = $(this).data("user");

        $("#modalUserImage").attr("src", user.userImage);
        $("#modalUserName").text(user.firstName + " " + user.lastName);
        $("#modalUserEmail").text(user.user.email);
        $("#modalUserMobile").text(user.mobile || "N/A");
        $("#modalUserAddress").text(user.address || "N/A");
        $("#modalUserRole").text(user.user.role);
        $("#modalUserSkills").text(user.user.skills?.length ? user.user.skills.join(", ") : "None");

        const statusBadge = $("#modalUserStatus");
        statusBadge.text(user.user.status);
        statusBadge.removeClass().addClass("badge " + (user.user.status === "ACTIVE" ? "bg-success" : "bg-danger"));

        $("#userDetailsModal").modal("show");
    });

    // Search filter
    $("#userSearch").on("input", function () {
        const searchValue = $(this).val().toLowerCase();
        $("#usersTable tr").filter(function () {
            $(this).toggle(
                $(this).text().toLowerCase().indexOf(searchValue) > -1
            );
        });
    });

    // Init
    loadUsers();
});

$("#closeBtn").on("click", function () {
    $("#userDetailModal").hide(); // hides the popup
});
