$("#openSidebar").on("click", function () {
    $("#sidebar").addClass("active");
});
$("#closeSidebar").on("click", function () {
    $("#sidebar").removeClass("active");
});

$(document).ready(function () {
    let userId = localStorage.getItem("needUserId") || null
    loadListings(userId);
    loadSkills(userId);
    loadData(userId)
});

$(document).on("click", ".view-btn", function () {
    const type = $(this).data("type"); // "tool" or "skill"
    const id = $(this).data("id");

    if (!id) {
        console.error("ID is undefined for view button");
        return;
    }

    // Build URL with query parameter
    const url = type === "tool"
        ? `http://localhost:8080/user/getatool?toolId=${id}`
        : `http://localhost:8080/user/getaskill?skillId=${id}`;

    $.ajax({
        url: url,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function(response) {
    const data = response.data;

    if (!data) {
        showNotification("No data found for this item.", "warning");
        return;
    }
     $("#listingModal")
        .data("listingType", type.toUpperCase())   // "TOOL" or "SKILL"
        .data("listingId", data.toolId || data.skillId) // backend returns toolId OR skillId
        .data("userId", data.userId);     
    // Populate modal with enhanced UX
    populateEnhancedModal(data, type);
    $("#listingModal").modal("show");
},

error: function(xhr, status, error) {
    console.error("Error fetching listing:", xhr.responseText || error);
    
    let errorMsg = "Could not load listing details.";
    let errorType = "error";
    
    switch(xhr.status) {
        case 401:
            errorMsg = "Please log in to view this item.";
            break;
        case 404:
            errorMsg = "This item is no longer available.";
            break;
        case 500:
            errorMsg = "Server error. Please try again later.";
            break;
        default:
            errorMsg = "Network error. Check your connection.";
    }
    
    showNotification(errorMsg, errorType);
}
    });
});

// Enhanced Modal Population Function
function populateEnhancedModal(data, type) {
    // Enhanced Header with Close Button
    const modalHeader = $("#listingModal .modal-header");
    modalHeader.html(`
        <div class="d-flex justify-content-between align-items-center w-100">
            <div>
                <h4 class="modal-title mb-1" id="modalTitle">${data.name || "Untitled Item"}</h4>
                <small class="text-muted">${type === "tool" ? "Tool Rental" : "Skill Service"}</small>
            </div>
            <button type="button" class="close ml-auto" data-dismiss="modal" aria-label="Close" style="font-size: 1.5rem; border: none; background: none; color: #6c757d; transition: color 0.2s ease;">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `);

    showBookingFields(type.toUpperCase());
    // Enhanced Description
    const description = data.description || "No description available.";
    $("#modalDescription").html(`
        <div class="description-container">
            <h6 class="text-muted mb-2">Description</h6>
            <p class="mb-0">${description}</p>
        </div>
    `);

    // Enhanced Condition Display for Tools
    if (type === "tool") {
    $("#modalConditionRow").show();

    // Use default value if condition is empty
    const condition = data.condition && data.condition.trim() !== "" ? data.condition : "N/A";
    
    // Get class based on condition (example: good → success, bad → danger)
    const conditionClass = getConditionClass(condition);

    // Update the badge
    $("#modalCondition").html(`
        <span class="badge bg-${conditionClass} px-3 py-2">${condition}</span>
    `);

    } else {
        $("#modalConditionRow").hide();
    }

    // Enhanced Price Display
    const price = data.price ? parseFloat(data.price) : 0;
    const formattedPrice = price > 0 ? `$${price.toFixed(2)}` : "Contact for Price";
    const priceType = data.priceType || "";
    
    $("#modalPrice").html(`
        <div class="price-container">
            <span class="h4 text-primary font-weight-bold">${formattedPrice}</span>
            ${priceType ? `<small class="text-muted ml-2">/ ${priceType}</small>` : ''}
        </div>
    `);

    // Enhanced Carousel with Better Error Handling
    buildEnhancedCarousel(data.imageUrls, data.name);

    // Enhanced Available Times
    buildEnhancedAvailableTimes(data.startDate, data.endDate,type,data.toolId || data.skillId);
}

// Enhanced Carousel Function
function buildEnhancedCarousel(imageUrls, itemName) {
    let carouselInner = $("#modalCarouselInner");
    carouselInner.empty();
    
    if (imageUrls && imageUrls.length > 0) {
        $.each(imageUrls, function(i, img) {
            const activeClass = i === 0 ? "active" : "";
            carouselInner.append(`
                <div class="carousel-item ${activeClass}">
                    <div class="image-container position-relative">
                        <img src="${img}" 
                             class="d-block w-100 rounded" 
                             alt="${itemName} - Image ${i + 1}"
                             style="height: 350px; object-fit: cover; transition: transform 0.3s ease;"
                             onload="this.style.opacity='1'"
                             onerror="handleImageError(this, ${i})"
                             onmouseover="this.style.transform='scale(1.02)'"
                             onmouseout="this.style.transform='scale(1)'">
                        <div class="image-overlay position-absolute" 
                             style="top: 10px; right: 10px; background: rgba(0,0,0,0.6); color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px;">
                            ${i + 1} of ${imageUrls.length}
                        </div>
                    </div>
                </div>
            `);
        });
        
        // Show/Hide carousel controls
        if (imageUrls.length > 1) {
            $("#modalCarousel .carousel-control-prev, #modalCarousel .carousel-control-next").show();
            // Add indicators if more than one image
            addCarouselIndicators(imageUrls.length);
        } else {
            $("#modalCarousel .carousel-control-prev, #modalCarousel .carousel-control-next").hide();
            $("#modalCarousel .carousel-indicators").hide();
        }
    } else {
        // Enhanced placeholder
        carouselInner.append(`
            <div class="carousel-item active">
                <div class="d-flex align-items-center justify-content-center bg-light rounded" 
                     style="height: 350px; border: 2px dashed #dee2e6;">
                    <div class="text-center text-muted">
                        <i class="fas fa-image fa-4x mb-3" style="opacity: 0.3;"></i>
                        <h5>No Images Available</h5>
                        <p class="mb-0">Images will be displayed here when available</p>
                    </div>
                </div>
            </div>
        `);
        $("#modalCarousel .carousel-control-prev, #modalCarousel .carousel-control-next").hide();
        $("#modalCarousel .carousel-indicators").hide();
    }
}

// Enhanced Available Times Function
function buildEnhancedAvailableTimes(startDate, endDate, type, toolId) {
    const ul = $("#availableTimes");
    ul.empty();

    if (!startDate || !endDate) {
        ul.append(`
            <li class="list-group-item text-center">
                <div class="py-4">
                    <i class="fas fa-calendar-times fa-3x text-muted mb-3" style="opacity: 0.3;"></i>
                    <h6 class="text-muted">No dates specified</h6>
                    <p class="text-muted mb-0">Contact the owner for availability</p>
                </div>
            </li>
        `);
        return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add header
    ul.append(`
        <li class="list-group-item bg-primary text-white">
            <div class="d-flex justify-content-between align-items-center">
                <h6 class="mb-0"><i class="fas fa-calendar-alt mr-2"></i>Available Dates</h6>
                <small>Click to select</small>
            </div>
        </li>
    `);

    function renderDays(bookedSet = new Set()) {
        let availableDays = 0;
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dayStr = d.toISOString().split("T")[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
            const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            const isPast = d < today;
            const isToday = d.toDateString() === today.toDateString();
            const isTomorrow = d.toDateString() === new Date(today.getTime() + 86400000).toDateString();
            const isBooked = bookedSet.has(dayStr);

            if (!isPast && !isBooked) availableDays++;

            let dateLabel = formattedDate;
            let badgeClass = "success";
            let badgeText = "";

            if (isPast) {
                badgeClass = "secondary";
                badgeText = "Past";
            } else if (isBooked) {
                badgeClass = "danger";
                badgeText = "Booked";
            } else if (isToday) {
                dateLabel = "Today";
                badgeClass = "info";
                badgeText = formattedDate;
            } else if (isTomorrow) {
                dateLabel = "Tomorrow";
                badgeClass = "info";
                badgeText = formattedDate;
            }

            ul.append(`
                <li class="list-group-item ${isPast || isBooked ? 'bg-light text-muted' : 'list-group-item-action'}" 
                    style="cursor: ${isPast || isBooked ? 'default' : 'pointer'};" 
                    ${!isPast && !isBooked ? `onclick="selectDate('${dayStr}')"` : ''}>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong class="${isPast || isBooked ? 'text-muted' : ''}">${dayName}</strong>
                            <br>
                            <small class="${isPast || isBooked ? 'text-muted' : 'text-primary'}">${dateLabel}</small>
                            ${badgeText && badgeText !== dateLabel ? `<br><small class="text-muted">${badgeText}</small>` : ''}
                        </div>
                        <span class="badge badge-${badgeClass}">${badgeText || 'Available'}</span>
                    </div>
                </li>
            `);
        }

        if (availableDays > 0) {
            ul.append(`
                <li class="list-group-item bg-light">
                    <small class="text-muted">
                        <i class="fas fa-info-circle mr-1"></i>
                        ${availableDays} available day${availableDays !== 1 ? 's' : ''} found
                    </small>
                </li>
            `);
        }
    }

    // If type is "tool", fetch booked days first
    if (type === "tool" && toolId) {
        const token = localStorage.getItem("token");
        $.ajax({
            url: "http://localhost:8080/user/gettoolbookeddays",
            type: "GET",
            data: { toolId: toolId },
            headers: { Authorization: `Bearer ${token}` },
            success: function(response) {
            let bookedArray = [];
            if (Array.isArray(response)) {
                bookedArray = response;
            } else if (response.data && Array.isArray(response.data)) {
                bookedArray = response.data;
            }
            const bookedSet = new Set(bookedArray.map(d => new Date(d).toISOString().split("T")[0]));
            renderDays(bookedSet);
        }
        ,
            error: function(err) {
                console.error("Error fetching booked days:", err);
                renderDays(); // fallback to normal rendering if AJAX fails
            }
        });
    } else {
        renderDays(); // normal function rendering if not a tool
    }
}

// Helper Functions
function getConditionClass(condition) {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('excellent') || conditionLower.includes('new')) return 'success';
    if (conditionLower.includes('good')) return 'primary';
    if (conditionLower.includes('fair')) return 'warning';
    if (conditionLower.includes('poor')) return 'danger';
    return 'secondary';
}

function showBookingFields(listingType) {
    const container = document.getElementById('bookingDateContainer');
    if (listingType === 'SKILL') {
        container.style.display = 'none';
    } else if (listingType === 'TOOL') {
        container.style.display = 'block';
    }
}



function handleImageError(img, index) {
    img.src = 'https://via.placeholder.com/400x350/f8f9fa/6c757d?text=Image+Unavailable';
    img.alt = `Image ${index + 1} unavailable`;
    img.style.opacity = '0.7';
}

function addCarouselIndicators(count) {
    const indicators = $("#modalCarousel .carousel-indicators");
    indicators.empty().show();
    
    for (let i = 0; i < count; i++) {
        indicators.append(`
            <li data-target="#modalCarousel" data-slide-to="${i}" ${i === 0 ? 'class="active"' : ''}></li>
        `);
    }
}

function selectDate(dateStr) {
    // Handle date selection (you can customize this)
    showNotification(`Selected date: ${dateStr}`, "info");
    // Add your date selection logic here
}

function showNotification(message, type = "info") {
    // Enhanced notification system
    if (typeof toastr !== 'undefined') {
        toastr[type](message);
    } else if (typeof Swal !== 'undefined') {
        const icon = type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'info';
        Swal.fire({
            icon: icon,
            text: message,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
    } else {
        // Fallback to styled alert
        const alertClass = type === 'error' ? 'alert-danger' : 
                          type === 'warning' ? 'alert-warning' : 
                          type === 'success' ? 'alert-success' : 'alert-info';
        
        const alertHtml = `
            <div class="alert ${alertClass} alert-dismissible fade show position-fixed" 
                 style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
                ${message}
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
            </div>
        `;
        
        $('body').append(alertHtml);
        setTimeout(() => $('.alert').alert('close'), 4000);
    }
}

// Modal Enhancement Events
$(document).ready(function() {
    // Add custom CSS for the close button
    if (!$('#modal-close-styles').length) {
        $('head').append(`
            <style id="modal-close-styles">
                .modal-close-btn {
                    width: 40px !important;
                    height: 40px !important;
                    border-radius: 50% !important;
                    background: rgba(0,0,0,0.1) !important;
                    border: none !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    transition: all 0.2s ease !important;
                    color: #6c757d !important;
                    font-size: 18px !important;
                }
                
                .modal-close-btn:hover {
                    background: rgba(220, 53, 69, 0.1) !important;
                    color: #dc3545 !important;
                    transform: scale(1.1) !important;
                }
                
                .modal-close-btn:focus {
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25) !important;
                    outline: none !important;
                }
                
                .modal-close-btn:active {
                    transform: scale(0.95) !important;
                }
                
                /* Alternative modern close button styles */
                .modal-close-modern {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    width: 32px;
                    height: 32px;
                    border: 2px solid #e9ecef;
                    border-radius: 50%;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: #6c757d;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 1060;
                }
                
                .modal-close-modern:hover {
                    border-color: #dc3545;
                    color: #dc3545;
                    background: #fff5f5;
                    transform: rotate(90deg);
                }
            </style>
        `);
    }
    
    // Ensure close button works with event delegation
    $(document).off('click', '[data-dismiss="modal"], [data-bs-dismiss="modal"]').on('click', '[data-dismiss="modal"], [data-bs-dismiss="modal"]', function() {
        $("#listingModal").modal("hide");
    });
    
    // Close modal on escape key
    $(document).keyup(function(e) {
        if (e.keyCode === 27 && $("#listingModal").hasClass('show')) {
            $("#listingModal").modal("hide");
        }
    });
    
    // Close modal when clicking outside
    $(document).on('click', '.modal', function(e) {
        if (e.target === this) {
            $(this).modal('hide');
        }
    });
    
    // Reset carousel on modal close
    $('#listingModal').on('hidden.bs.modal', function () {
        $("#modalCarousel").carousel(0);
    });
    
    // Add smooth scrolling within modal
    $('#listingModal').on('shown.bs.modal', function () {
        $(this).find('.modal-body').css('scroll-behavior', 'smooth');
    });
});


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
    

function loadListings(userId) {
    const token = localStorage.getItem("token");
    if (userId === null) {
        userId = localStorage.getItem("userId")
    }
  $.ajax({
    url: "http://localhost:8080/getprofile/getprofiletools",
    type: "GET",
    data: {userId: userId},
    headers: {
      "Authorization": "Bearer " + token
    },
    success: function(response) {
      const listings = response.data; // ✅ your array is inside "data"

      if (!Array.isArray(listings)) {
        console.error("Expected array in response.data but got:", listings);
        return;
      }

      const container = $("#listingContainer");
      container.empty();

      listings.forEach((listing, index) => {
        // Create carousel slides
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
    },
    error: function(xhr, status, error) {
      console.error("Error loading listings:", xhr.responseText);
    }
  });
}

function loadSkills(userId) {
    if (userId === null) {
        userId = localStorage.getItem("userId")
    }
  const token = localStorage.getItem("token");

  $.ajax({
    url: "http://localhost:8080/getprofile/getprofileskills",
    type: "GET",
    data: {userId},
    headers: {
      "Authorization": "Bearer " + token
    },
    success: function(response) {
      const skills = response.data;

      if (!Array.isArray(skills)) {
        console.error("Expected array in response.data but got:", skills);
        return;
      }

      const container = $("#skillsContainer");
      container.empty();

      skills.forEach((skill, index) => {
        // Create carousel slides
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
    },
    error: function(xhr, status, error) {
      console.error("Error loading skills:", xhr.responseText);
    }
  });
}


    function loadData(userId) {
        if (userId === null) {
            userId = localStorage.getItem("userId")
        }
        $.ajax({
            url: "http://localhost:8080/getprofile/getprofildetails",
            type: "GET",
            data: { userId:userId  },
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            contentType: "application/json",
            success: function (res) {
                let userData = res.data
                // Set values in DOM
                $("#fullName").text(userData.firstName + " " + userData.lastName);
                $("#role").text(userData.user.role);
                $("#email").text(userData.user.email);
                $("#phone").text(userData.mobile);
                $("#address").text(userData.address);
                $("#username").text(userData.user.username);
                $("#Role").text(userData.user.role || "N/A");
                $("#status").text(userData.user.status || "Active");

                // Profile image (fallback if null)
                $("#profileImage").attr("src",
                    userData.userImage ? userData.userImage : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop"
                );
            },
            error: function (xhr, status, error) {
                console.error("Error fetching profile:", error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to load profile details!",
                });
            }
        });
    }

    
