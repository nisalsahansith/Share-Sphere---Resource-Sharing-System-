$(document).ready(function () {

    // =================================
    // Variables
    // =================================
    let uploadedImages = [];
    let selectedImages = [];
    let uploadedEditImages = [];
    let existingImages = [];

    // =================================
    // Initial Load
    // =================================
    loadUserListings();
    renderPreview(); // Initial image preview state

    // =================================
    // Image Upload & Preview (Create Listing)
    // =================================
    function renderPreview() {
        const container = $('#imagePreview');
        container.empty();

        // Render uploaded images
        uploadedImages.forEach((imgSrc, index) => {
            container.append(`
                <div class="position-relative d-inline-block me-2 mb-2">
                    <img src="${imgSrc}" class="img-thumbnail" style="width:120px; height:120px; object-fit:cover;">
                    <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 remove-image" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `);
        });
    }

    $(document).on('change', '#listingImage', function (e) {
        let files = Array.from(e.target.files);
        files.forEach(file => {
            let reader = new FileReader();
            reader.onload = function (event) {
                uploadedImages.push(event.target.result);
                renderPreview();
            };
            reader.readAsDataURL(file);
        });
    });

    $(document).on("click", ".remove-image", function () {
        const index = $(this).data("index");
        uploadedImages.splice(index, 1);
        renderPreview();
    });

    // =================================
    // Toggle Availability Fields
    // =================================
    $('input[name="availabilityType"]').on('change', function () {
        if ($(this).val() === 'time') {
            $('#timeFields').removeClass('d-none');
            $('#dateFields').addClass('d-none');
        } else {
            $('#timeFields').addClass('d-none');
            $('#dateFields').removeClass('d-none');
        }
    });

    // =================================
    // Create Listing Form Submission
    // =================================
    $("#createListingForm").on("submit", function (e) {
        e.preventDefault();

        $("#createListingForm :input").prop("disabled", true);

        Swal.fire({
            title: 'Creating listing...',
            text: 'Please wait while we process your request.',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        let formData = new FormData();
        formData.append("name", $("#listingTitle").val());
        formData.append("description", $("#listingDescription").val());
        formData.append("startDate", $("#startDate").val());
        formData.append("endDate", $("#endDate").val());
        formData.append("userId", localStorage.getItem("userId"));
        formData.append("availability", "AVAILABLE");
        formData.append("priceType", $("#listingPriceType").val());
        formData.append("price", $("#listingPriceDay").val());
        formData.append("listingType", $("#listingType").val());
        formData.append("condition", $("#listingCondition").val());
        formData.append("country", $("#listingCountry").val());
        formData.append("state", $("#listingProvince").val());

        uploadedImages.forEach((img) => {
            let blob = dataURLtoBlob(img);
            formData.append("images", blob);
        });

        $.ajax({
            url: "http://localhost:8080/postlisting/createlisting",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
            success: function () {
                Swal.fire({ icon: "success", title: "Success!", text: "Listing created successfully!" })
                    .then(() => {
                        $("#createListingModal").modal("hide");
                        loadUserListings();
                        $("#createListingForm")[0].reset();
                        $("#imagePreview").empty();
                        uploadedImages = [];
                    });
            },
            error: function (xhr) {
                Swal.fire({ icon: "error", title: "Failed!", text: "Failed to create listing." });
                console.error(xhr.responseText);
            },
            complete: function () {
                $("#createListingForm :input").prop("disabled", false);
            }
        });
    });

    // =================================
    // Load User Listings (Skills & Tools)
    // =================================
    function loadUserListings() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    $("#skillsTableBody, #toolsTableBody").empty();

    // Skills
    $.ajax({
        url: "http://localhost:8080/postlisting/skills",
        data: { userId },
        type: "GET",
        headers: { "Authorization": "Bearer " + token },
        success: function (response) {
            let skills = response.data || [];

            // Sort by createdAt DESC
            skills.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            if (!skills.length) {
                $("#skillsTable").hide();
                $("#noSkillsMessage").show();
            } else {
                $("#skillsTable").show();
                $("#noSkillsMessage").hide();
                skills.forEach(skill => {
                    let imageUrl = skill.imageUrls?.[0] || "/assets/images/OIP.webp";
                    $("#skillsTableBody").append(`
                        <tr data-id="${skill.skillId}" data-type="skill">
                            <td><img src="${imageUrl}" class="table-thumbnail"></td>
                            <td>${skill.name}</td>
                            <td>${skill.availability}</td>
                            <td>${skill.startDate}</td>
                            <td>${skill.endDate}</td>
                            <td>
                                <button class="btn btn-info btn-sm view-skill">View</button>
                                <button class="btn btn-warning btn-sm edit-skill">Edit</button>
                                <button class="btn btn-danger btn-sm delete-skill">Delete</button>
                            </td>
                        </tr>
                    `);
                });
            }
        },
        error: function (xhr) { console.error("Failed to fetch skills", xhr.responseText); }
    });

    // Tools
    $.ajax({
        url: "http://localhost:8080/postlisting/tools",
        data: { userId },
        type: "GET",
        headers: { "Authorization": "Bearer " + token },
        success: function (response) {
            let tools = response.data || [];

            // Sort by createdAt DESC
            tools.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            if (!tools.length) {
                $("#toolsTable").hide();
                $("#noToolsMessage").show();
            } else {
                $("#toolsTable").show();
                $("#noToolsMessage").hide();
                tools.forEach(tool => {
                    let imageUrl = tool.imageUrls?.[0] || "/assets/images/OIP.webp";
                    $("#toolsTableBody").append(`
                        <tr data-id="${tool.toolId}" data-type="tool">
                            <td><img src="${imageUrl}" class="table-thumbnail"></td>
                            <td>${tool.name}</td>
                            <td>${tool.availabilityStatus}</td>
                            <td>${tool.startDate}</td>
                            <td>${tool.endDate}</td>
                            <td>
                                <button class="btn btn-info btn-sm view-tool">View</button>
                                <button class="btn btn-warning btn-sm edit-tool">Edit</button>
                                <button class="btn btn-danger btn-sm delete-tool">Delete</button>
                            </td>
                        </tr>
                    `);
                });
            }
        },
        error: function (xhr) { console.error("Failed to fetch tools", xhr.responseText); }
    });
    }

    // =================================
    // Helper: Convert Base64 to Blob
    // =================================
    function dataURLtoBlob(dataurl) {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1];
        let bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) { u8arr[n] = bstr.charCodeAt(n); }
        return new Blob([u8arr], { type: mime });
    }

    // =================================
    // Edit Listing Logic (Preview + Modal)
    // =================================
    function renderEditPreview() {
        const container = $('#editImagePreview');
        container.empty();

        existingImages.forEach((url, index) => {
            container.append(`
                <div class="position-relative d-inline-block me-2 mb-2">
                    <img src="${url}" class="img-thumbnail" style="width:120px; height:120px; object-fit:cover;">
                    <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 remove-existing-image" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `);
        });

        uploadedEditImages.forEach((imgSrc, index) => {
            container.append(`
                <div class="position-relative d-inline-block me-2 mb-2">
                    <img src="${imgSrc}" class="img-thumbnail" style="width:120px; height:120px; object-fit:cover;">
                    <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 remove-new-image" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `);
        });
    }

    function loadExistingImagesFromListing(imageUrls) {
        existingImages = [...imageUrls];
        renderEditPreview();
    }

    $(document).on('change', '#editListingImage', function (e) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = function (event) {
                uploadedEditImages.push(event.target.result);
                renderEditPreview();
            };
            reader.readAsDataURL(file);
        });
        $(this).val('');
    });

    $(document).on('click', '.remove-existing-image', function () {
        const index = $(this).data('index');
        existingImages.splice(index, 1);
        renderEditPreview();
    });

    $(document).on('click', '.remove-new-image', function () {
        const index = $(this).data('index');
        uploadedEditImages.splice(index, 1);
        renderEditPreview();
    });

    // =================================
    // Edit Listing Form Submit
    // =================================
    $("#editListingForm").on("submit", function (e) {
        e.preventDefault();

        $("#editListingForm :input").prop("disabled", true);

        Swal.fire({
            title: 'Updating listing...',
            text: 'Please wait while we process your request.',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        let formData = new FormData();
        const listingType = $("#editListingType").val();

        formData.append("listingId", $("#ListingId").text());
        formData.append("priceId", $("#editListingPriceId").val());
        formData.append("name", $("#editListingTitle").val());
        formData.append("description", $("#editListingDescription").val());
        formData.append("startDate", $("#editStartDate").val());
        formData.append("endDate", $("#editEndDate").val());
        formData.append("availability", $("#editAvailability").val() || "AVAILABLE");
        formData.append("priceType", $("#editListingPriceType").val());
        formData.append("price", $("#editListingPriceDay").val());
        formData.append("listingType", listingType);
        formData.append("condition", $("#editListingCondition").val());
        formData.append("country", $("#editListingCountry").val());
        formData.append("state", $("#editListingProvince").val());

        existingImages.forEach(url => formData.append("existingImages", url));
        uploadedEditImages.forEach(img => formData.append("images", dataURLtoBlob(img)));

        $.ajax({
            url: "http://localhost:8080/postlisting/updatelisting",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
            success: function () {
                Swal.fire({ icon: "success", title: "Updated!", text: "Listing updated successfully!" })
                    .then(() => {
                        $("#editListingModal").modal("hide");
                        loadUserListings();
                        uploadedEditImages = [];
                        existingImages = [];
                        $("#editListingForm")[0].reset();
                        $("#editImagePreview").empty();
                    });
            },
            error: function (xhr) {
                Swal.fire({ icon: "error", title: "Failed!", text: "Failed to update listing." });
                console.error(xhr.responseText);
            },
            complete: function () {
                $("#editListingForm :input").prop("disabled", false);
            }
        });
    });

    // =================================
    // Delete Listing
    // =================================
    $(document).on("click", ".delete-tool, .delete-skill", function () {
        let row = $(this).closest("tr");
        let id = row.data("id");
        let type = $(this).hasClass("delete-tool") ? "tool" : "skill";
        let token = localStorage.getItem("token");

        if (!token) {
            Swal.fire({ icon: 'error', title: 'Unauthorized', text: 'You are not logged in.' });
            return;
        }

        Swal.fire({
            title: `Are you sure you want to delete this ${type}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `http://localhost:8080/postlisting/delete/${type}/${id}`,
                    type: "DELETE",
                    headers: { "Authorization": "Bearer " + token },
                    success: function () {
                        Swal.fire({ icon: 'success', title: `${type} deleted!`, timer: 1500, showConfirmButton: false });
                        row.remove();
                    },
                    error: function (xhr) {
                        Swal.fire({ icon: 'error', title: `Failed to delete ${type}`, text: xhr.responseText || 'Something went wrong!' });
                    }
                });
            }
        });
    });

    // =================================
    // Edit / View Buttons Logic
    // =================================
    $(document).on("click", ".edit-skill, .edit-tool", function () {
        let id = $(this).closest("tr").data("id");
        let type = $(this).hasClass("edit-skill") ? "skill" : "tool";
        const token = localStorage.getItem("token");

        $.ajax({
            url: `http://localhost:8080/postlisting/get/${type}?${type}Id=${id}`,
            type: "GET",
            headers: { "Authorization": "Bearer " + token },
            success: function (response) {
                const listing = response.data;
                $("#ListingId").text(listing.skillId || listing.toolId);
                $("#editListingType").val(type);
                $("#editListingTitle").val(listing.name || "");
                $("#editListingPriceId").val(listing.pricingId);
                console.log("Price ID:", listing.pricingId);
                $("#editListingDescription").val(listing.description || "");
                $("#editListingPriceType").val(listing.priceType?.toLowerCase() || "");
                $("#editListingPriceDay").val(listing.price || "");
                $("#editStartDate").val(listing.startDate || "");
                $("#editEndDate").val(listing.endDate || "");

                if (type === "tool") {
                    $("#editToolFields").removeClass("d-none");
                    $("#editListingCondition").val(listing.condition || "");
                    $("#editListingCountry").val(listing.country || "");
                    $("#editListingProvince").val(listing.state || "");
                } else {
                    $("#editToolFields").addClass("d-none");
                }

                loadExistingImagesFromListing(listing.imageUrls || []);
                $("#editListingModalLabel").text(type === "skill" ? "Edit Skill" : "Edit Tool");
                $("#editListingModal").modal("show");
            },
            error: function () { alert("Failed to load listing details."); }
        });
    });

    $(document).on("click", ".view-tool, .view-skill", function () {
        let id = $(this).closest("tr").data("id");
        let type = $(this).hasClass("view-tool") ? "tool" : "skill";
        const token = localStorage.getItem("token");

        $.ajax({
            url: `http://localhost:8080/postlisting/get/${type}?${type}Id=${id}`,
            type: "GET",
            headers: { "Authorization": "Bearer " + token },
            success: function (response) {
                let data = response.data;
                let images = data.imageUrls?.length ? data.imageUrls : ["/assets/images/OIP.webp"];

                let carouselContent = images.map((img, i) => `
                    <div class="carousel-item ${i === 0 ? "active" : ""}">
                        <img src="${img}" class="d-block w-100 rounded">
                    </div>`).join("");

                $("#carouselImages").html(carouselContent);

                let detailsHtml = `
                    <h4>${data.name}</h4>
                    <p><strong>Description:</strong> ${data.description || "N/A"}</p>
                    <p><strong>Available:</strong> ${data.availability}</p>
                `;

                if (type === "tool") {
                    detailsHtml += `
                        <p><strong>Condition:</strong> ${data.condition}</p>
                        <p><strong>Status:</strong> ${data.availabilityStatus}</p>
                        <p><strong>Location:</strong> ${data.country}, ${data.state}</p>
                        <p><strong>Available:</strong> ${data.startDate} → ${data.endDate}</p>
                    `;
                } else {
                    detailsHtml += `<p><strong>Created At:</strong> ${data.createdAt}</p>`;
                }

                $("#listingDetails").html(detailsHtml);
                new bootstrap.Modal(document.getElementById("viewModal")).show();
            },
            error: function (xhr) { alert("Failed to load details."); console.error(xhr.responseText); }
        });
    });

    // =================================
    // Listing Type Change
    // =================================
    $("#listingType").on("change", function () {
        $(this).val() === "tool" ? $("#toolFields").removeClass("d-none") : $("#toolFields").addClass("d-none");
    });
});
