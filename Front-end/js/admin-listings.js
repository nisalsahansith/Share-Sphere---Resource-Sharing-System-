

        $(document).ready(function () {
    function loadListings() {
        $.ajax({
            url: "http://localhost:8080/admin/listings/all",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            success: function (response) {
                const data = response.data; 
                if (!Array.isArray(data) || data.length < 2) {
                    console.error("Invalid response:", response);
                    return;
                }

                const skills = data[0] || [];
                const tools = data[1] || [];

                // merge & mark type
                const listings = [
                    ...skills.map(s => ({ ...s, type: "Skill" })),
                    ...tools.map(t => ({ ...t, type: "Tool" }))
                ];

                window.allListings = listings;

                // sort by createdAt (latest first)
                listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                // render table
                const $table = $("#listingsTable");
                $table.empty();

                listings.forEach((item, index) => {
                    const id = item.skillId || item.toolId;
                    const title = item.name || "-";
                     const owner = item.userId 
                            ? item.userId.length > 8 
                                ? item.userId.substring(0, 6) + "..." 
                                : item.userId 
                            : "Unknown";
                    const price = item.price ? `$${item.price}` : "Free";
                    const priceType = item.priceType || "";
                    const created = item.createdAt ? item.createdAt.split("T")[0] : "-";

                    const status = item.availability || item.availabilityStatus || "UNKNOWN";
                    const statusBadge =
                        status === "AVAILABLE"
                            ? `<span class="badge-active">Available</span>`
                            : `<span class="badge-restricted">Restricted</span>`;

                    const preview =
                        item.imageUrls && item.imageUrls.length > 0
                            ? `<img src="${item.imageUrls[0]}" class="rounded" width="50" height="50">`
                            : `<div class="bg-light text-muted d-flex align-items-center justify-content-center rounded" style="width:50px;height:50px;">N/A</div>`;

                    const actions = `
                        <button class="btn-action btn-view" data-id="${id}" data-type="${item.type}">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${status === "AVAILABLE"
                            ? `<button class="btn-action btn-restrict" data-id="${id}" data-type="${item.type}">
                                    <i class="fas fa-ban"></i>
                               </button>`
                            : `<button class="btn-action btn-unrestrict" data-id="${id}" data-type="${item.type}">
                                    <i class="fas fa-unlock"></i>
                               </button>`
                        }
                    `;

                    $table.append(`
                        <tr data-listingid="${id}" data-type="${item.type}">
                            <td>#${index + 1}</td>
                            <td>${preview}</td>
                            <td><span class="badge bg-${item.type === "Skill" ? "primary" : "info"}">${item.type}</span></td>
                            <td>${title}</td>
                            <td>${owner}</td>
                            <td>${price} <small class="text-muted">${priceType}</small></td>
                            <td>${statusBadge}</td>
                            <td>${created}</td>
                            <td>${actions}</td>
                        </tr>
                    `);
                });
            },
            error: function (xhr) {
                console.error("Error fetching listings:", xhr);
            }
        });
    }

    // Load listings on page load
    loadListings();
    });

    
        


$("#listingsTable").on("click", ".btn-view", function () {
    const id = $(this).data("id");
    const type = $(this).data("type");

    // Find clicked item from already loaded listings
    const item = window.allListings.find(
        l => (l.skillId || l.toolId) === id && l.type === type
    );

    if (!item) {
        console.error("Listing not found:", id, type);
        return;
    }

    // Fill details
    $("#listingTitle").text(item.name || "-");
    $("#listingType").text(item.type);
    $("#listingOwner").text(item.userId || "Unknown");
    $("#listingDescription").text(item.description || "No description");
    $("#listingPrice").text(item.price ? `$${item.price} (${item.priceType})` : "Free");
    $("#listingStatus").html(
        (item.availability || item.availabilityStatus) === "AVAILABLE"
            ? `<span class="badge bg-success">Available</span>`
            : `<span class="badge bg-danger">Restricted</span>`
    );
    $("#listingCreated").text(item.createdAt ? item.createdAt.split("T")[0] : "-");
    $("#listingStart").text(item.startDate || "-");
    $("#listingEnd").text(item.endDate || "-");

    // Fill carousel images
    const $carousel = $("#carouselImages");
    $carousel.empty();
    if (item.imageUrls && item.imageUrls.length > 0) {
    item.imageUrls.forEach((url, i) => {
        $("#carouselImages").append(`
            <div class="carousel-item ${i === 0 ? "active" : ""}">
                <img src="${url}" class="d-block w-100 rounded" style="max-height:400px;object-fit:cover;">
            </div>
        `);
    });
} else {
    $("#carouselImages").html(`
        <div class="carousel-item active">
            <div class="d-flex align-items-center justify-content-center bg-light text-muted" style="height:400px;">
                No Image Available
            </div>
        </div>
    `);
}


 // Get the modal element
const modalEl = document.getElementById('listingDetailsModal');

// Initialize the modal
const modal = new bootstrap.Modal(modalEl, {
    backdrop: 'static', // optional, example
    keyboard: true
});

// Show the modal
modal.show();

});

// Handle Restrict button click
$("#listingsTable").on("click", ".btn-restrict", function () {
    const $btn = $(this);
    const listingId = $btn.data("id");
    const type = $btn.data("type");

    Swal.fire({
        title: "Restrict this listing?",
        text: "The listing will be hidden from users.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, restrict",
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "http://localhost:8080/admin/listings/restriclisting",
                type: "PUT",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                data: {
                    listingId: listingId,
                    type: type
                },
                success: function (response) {
                    if (response.code === 200) {
                        // Show success alert
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: response.data
                        });

                        // Update button and status badge in the table
                        const $row = $btn.closest("tr");
                        $row.find("td:nth-child(7)").html('<span class="badge-restricted">Restricted</span>');
                        $btn.replaceWith(`
                    <button class="btn-action btn-unrestrict" data-id="${listingId}" data-type="${type}">
                        <i class="fas fa-unlock"></i>
                    </button>
                `);
                    }
                },
                error: function (xhr) {
                    console.error("Error restricting listing:", xhr);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to restrict listing.'
                    });
                }
            });
        }
    });
});

// Handle Unrestrict button click
$("#listingsTable").on("click", ".btn-unrestrict", function () {
    const $btn = $(this);
    const listingId = $btn.data("id");
    const type = $btn.data("type");

    
    Swal.fire({
        title: "Unrestrict this listing?",
        text: "The listing will be visible again.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, unrestrict",
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "http://localhost:8080/admin/listings/unrestriclisting",
                type: "PUT",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                data: {
                    listingId: listingId,
                    type: type
                },
                success: function (response) {
                    if (response.code === 200) {
                        // Show success alert
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: response.data
                        });

                        // Update button and status badge in the table
                        const $row = $btn.closest("tr");
                        $row.find("td:nth-child(7)").html('<span class="badge-active">Available</span>');
                        $btn.replaceWith(`
                    <button class="btn-action btn-restrict" data-id="${listingId}" data-type="${type}">
                        <i class="fas fa-ban"></i>
                    </button>
                `);
                    }
                },
                error: function (xhr) {
                    console.error("Error unrestricting listing:", xhr);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to unrestrict listing.'
                    });
                }
            });
        }
    });
});
