$(document).ready(function () {
        // Listing modal data setup
        $('#listingModal').on('show.bs.modal', function (event) {
            const button = $(event.relatedTarget);
            $('#modalTitle').text(button.data('title'));
            $('#modalDescription').text(button.data('description'));
            $('#modalCondition').text(button.data('conditions'));
            $('#modalPriceHour').text(button.data('pricehour'));
            $('#modalPriceDay').text(button.data('priceday'));
            $('#modalImage').attr('src', button.data('image'));
        });

        // Show payment modal after booking form submit
        $('#bookingForm').on('submit', function (e) {
            e.preventDefault();

            // Close booking modal
            $('#listingModal').modal('hide');

            // Open payment modal
            $('#paymentModal').modal('show');
        });

        // Toggle card details based on payment method
        $('#paymentMethod').on('change', function () {
            if ($(this).val() === 'card') {
                $('#cardDetails').show();
            } else {
                $('#cardDetails').hide();
            }
        });

        // Handle payment form submit
        $('#paymentForm').on('submit', function (e) {
            e.preventDefault();
            alert("✅ Payment Successful! Your booking is confirmed.");

            // Close payment modal
            $('#paymentModal').modal('hide');
        });
});
    
$("#bookingForm").on("submit", function (e) {
    e.preventDefault();

    let token = localStorage.getItem("token");
    if (!token) {
        Swal.fire({
            icon: "warning",
            title: "Login Required",
            text: "Please log in to book this item.",
        });
        return;
    }

    const listingType = $("#listingModal").data("listingType"); // SKILL or TOOL
    console.log("Listing Type:", listingType); // Debugging line
    const userId = localStorage.getItem("userId"); 
    const listingId = $("#listingModal").data("listingId"); 
    const message = $("#bookingMessage").val();
    const selectedDate = $("#bookingDate").val(); 
    const priceText = $("#modalPrice").text();
    const priceNumber = parseFloat(priceText.replace(/[^0-9.]/g, '')); // 10

    console.log("price:", priceNumber); // Debugging line
    const now = new Date();
    const requestedDate = now.toISOString().slice(0, 19); 
    console.log(requestedDate); 

    if (!selectedDate && listingType === "TOOL") {
        Swal.fire({
            icon: "warning",
            title: "Select Date",
            text: "Please select a date to book this tool.",
        });
        return;
    }

    let payload = {};
    let url = "";

    if (listingType === "TOOL") {
        const borrowStartDate = selectedDate + "T00:00:00";
        const borrowEndDate = selectedDate + "T23:59:59";
        const totPrice = priceNumber;

        const dates = borrowEndDate - borrowStartDate;
        if (dates > 0) {
            totPrice = priceNumber * dates;
        }

        payload = {
            requesterId: userId,
            toolId: listingId,
            status: "PENDING",
            borrowStartDate: borrowStartDate,
            borrowEndDate: borrowEndDate,
            message: message
            , price: totPrice
        };

        url = "http://localhost:8080/browse/requesttool";

    } else if (listingType === "SKILL") {
        payload = {
            requesterId: userId,
            skillId: listingId,
            status: "PENDING",
            requestedDates: requestedDate, 
            message: message,
            price: priceNumber
        };

        url = "http://localhost:8080/browse/requestskill";
    }

    // Show SweetAlert loading
    Swal.fire({
        title: "Processing...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    $.ajax({
        url: url,
        type: "POST",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token
        },
        data: JSON.stringify(payload),
        success: function (response) {
            Swal.close(); // close loading

            Swal.fire({
                icon: "success",
                title: "Success",
                text: response.message || (listingType === "TOOL" ? "Tool booking request sent successfully!" : "Skill request sent successfully!")
            });

            $("#listingModal").modal("hide");
        },
        error: function (xhr) {
            Swal.close(); // close loading

            Swal.fire({
                icon: "error",
                title: "Error",
                text: xhr.responseJSON?.message || "Something went wrong."
            });
        }
    });
});


$(document).ready(function() {
    const token = localStorage.getItem("token");
    const loggedUserId = localStorage.getItem("userId");

    let allListings = []; // all listings except current user
    let allSkills = [];   // all skills except current user

    // ------------------- FETCH LISTINGS -------------------
    function fetchListings() {
        $.ajax({
            url: "http://localhost:8080/user/getalltools",
            type: "GET",
            headers: { "Authorization": "Bearer " + token },
            success: function(response) {
                allListings = response.data.filter(item => item.userId != loggedUserId);
                renderListings(allListings);
            },
            error: function(xhr) {
                console.error("Failed to fetch listings", xhr);
            }
        });
    }

    // Render listings dynamically
    function renderListings(listings) {
        const container = $("#listingContainer");
        container.empty();

        if(listings.length === 0) {
            container.append(`<p class="text-muted">No listings found.</p>`);
            return;
        }

        listings.forEach(listing => {
            let carouselItems = listing.imageUrls.map((img, i) => `
          <div class="carousel-item ${i === 0 ? "active" : ""}">
            <img src="${img}" class="d-block w-100" style="height: 180px; object-fit: cover;" alt="${listing.name}">
          </div>
        `).join("");

        // Create card HTML
        const card = `
          <div class="card listing-card" style="width: 250px;">
            <div id="carousel-${listing.toolId}" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner">
                ${carouselItems}
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${listing.toolId}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon"></span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carousel-${listing.toolId}" data-bs-slide="next">
                <span class="carousel-control-next-icon"></span>
              </button>
            </div>
            <div class="card-body">
              <h5 class="card-title">${listing.name}</h5>
              <p class="card-text">Available for rent</p>
              <p class="fw-bold">$${listing.price} ${listing.priceType === "PER_DAY" ? "/day" : "/hour"}</p>
              <button 
                class="btn btn-primary btn-sm view-btn" 
                data-bs-toggle="modal" 
                data-bs-target="#listingModal"
                data-type="tool"
                data-id="${listing.toolId}"
                data-title="${listing.name}"
                data-price="${listing.price}"
                data-pricetype="${listing.priceType}"
                data-description="${listing.description}"
                data-conditions="${listing.condition}"
                data-images='${JSON.stringify(listing.imageUrls)}'
                >
                View
            </button>

            </div>
          </div>
        `;

        container.append(card);
        });
    }

    // ------------------- FETCH SKILLS -------------------
    function fetchSkills() {
        $.ajax({
            url: "http://localhost:8080/user/getallskills",
            type: "GET",
            headers: { "Authorization": "Bearer " + token },
            success: function(response) {
                allSkills = response.data.filter(skill => skill.userId != loggedUserId);
                renderSkills(allSkills);
            },
            error: function(xhr) {
                console.error("Failed to fetch skills", xhr);
            }
        });
    }

    // Render skills dynamically
    function renderSkills(skills) {
        const container = $("#skillsContainer");
        container.empty();

        if(skills.length === 0) {
            container.append(`<p class="text-muted">No skills found.</p>`);
            return;
        }

        skills.forEach(skill => {
            let carouselItems = skill.imageUrls.map((img, i) => `
          <div class="carousel-item ${i === 0 ? "active" : ""}">
            <img src="${img}" class="d-block w-100" style="height: 180px; object-fit: cover;" alt="${skill.name}">
          </div>
        `).join("");

        // Create card HTML
        const card = `
          <div class="card listing-card" style="width: 250px;">
            <div id="skill-carousel-${skill.skillId}" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner">
                ${carouselItems}
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#skill-carousel-${skill.skillId}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon"></span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#skill-carousel-${skill.skillId}" data-bs-slide="next">
                <span class="carousel-control-next-icon"></span>
              </button>
            </div>
            <div class="card-body">
              <h5 class="card-title">${skill.name}</h5>
              <p class="card-text">${skill.availability}</p>
              <p class="fw-bold">$${skill.price} ${skill.priceType === "PER_DAY" ? "/day" : "/Fixed"}</p>
              <button 
                class="btn btn-primary btn-sm view-btn" 
                data-bs-toggle="modal" 
                data-bs-target="#listingModal"
                data-type="skill"
                data-id="${skill.skillId}"
                data-title="${skill.name}"
                data-price="${skill.price}"
                data-pricetype="${skill.priceType}"
                data-description="${skill.description}"
                data-conditions="${skill.availability}"
                data-images='${JSON.stringify(skill.imageUrls)}'
                >
                View
            </button>

            </div>
          </div>
        `;

        container.append(card);
        });
    }

    // ------------------- SEARCH & FILTER -------------------
    function applySearchFilter() {
        const searchQuery = $("#searchInput").val().toLowerCase();
        const selectedDistrict = $("#districtFilter").val();

        // Filter listings
        let filteredListings = allListings;
        if(searchQuery) {
            filteredListings = filteredListings.filter(item => 
                item.name.toLowerCase().includes(searchQuery) || 
                item.description.toLowerCase().includes(searchQuery)
            );
        }
        if(selectedDistrict) {
            filteredListings = filteredListings.filter(item => item.district?.toLowerCase() === selectedDistrict.toLowerCase());
        }
        renderListings(filteredListings);

        // Filter skills
        let filteredSkills = allSkills;
        if(searchQuery) {
            filteredSkills = filteredSkills.filter(skill => 
                skill.name.toLowerCase().includes(searchQuery) || 
                skill.description.toLowerCase().includes(searchQuery)
            );
        }
        if(selectedDistrict) {
            filteredSkills = filteredSkills.filter(skill => skill.district?.toLowerCase() === selectedDistrict.toLowerCase());
        }
        renderSkills(filteredSkills);
    }

    // ------------------- EVENT LISTENERS -------------------
    $("#searchInput").on("keyup", applySearchFilter);
    $("#applyFilter").on("click", applySearchFilter);
    $("#resetFilter").on("click", function() {
        $("#searchInput").val("");
        $("#districtFilter").val("");
        renderListings(allListings);
        renderSkills(allSkills);
    });

    // ------------------- INITIAL FETCH -------------------
    fetchListings();
    fetchSkills();
});
