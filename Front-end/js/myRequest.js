    // Enhanced JavaScript Functions
    function filterBookings(status) {
        const tabs = document.querySelectorAll('.filter-tab');
        const bookings = document.querySelectorAll('.booking-item');
        const container = document.getElementById('bookingsContainer');
        const emptyState = document.getElementById('emptyState');

        // Update active tab
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.filter === status) {
                tab.classList.add('active');
            }
        });

        // Add loading effect
        container.style.opacity = '0.5';

        setTimeout(() => {
            let visibleCount = 0;

            bookings.forEach((booking, index) => {
                const bookingStatus = booking.dataset.status;

                if (status === 'all' || bookingStatus === status ||
                    (status === 'active' && (bookingStatus === 'confirmed' || bookingStatus === 'pending'))) {
                    booking.style.display = 'block';
                    booking.style.animationDelay = `${index * 0.1}s`;
                    visibleCount++;
                } else {
                    booking.style.display = 'none';
                }
            });

            // Show/hide empty state
            if (visibleCount === 0) {
                emptyState.style.display = 'block';
            } else {
                emptyState.style.display = 'none';
            }

            container.style.opacity = '1';
        }, 200);
    }

    function openBookingModal(bookingId) {
        const modal = new bootstrap.Modal(document.getElementById('bookingModal1'));
        modal.show();
    }

    function openChat(bookingId) {
        // Add loading spinner
        event.target.innerHTML = '<div class="spinner"></div>';

        setTimeout(() => {
            alert(`Opening chat for booking: ${bookingId}`);
            event.target.innerHTML = '<i class="fas fa-comments"></i>';
        }, 1000);
    }

    function showCancelConfirm(bookingId) {
        if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
            cancelBooking(bookingId);
        }
    }

    function cancelBooking(bookingId) {
        const button = event.target.closest('.action-icon');
        button.innerHTML = '<div class="spinner"></div>';

        setTimeout(() => {
            alert(`Booking ${bookingId} cancelled successfully!`);
            // Update UI or reload page
            location.reload();
        }, 1500);
    }

    function showRatingModal(bookingId) {
        const rating = prompt('Rate your experience (1-5 stars):');
        if (rating && rating >= 1 && rating <= 5) {
            alert(`Thank you for rating! You gave ${rating} stars.`);
        }
    }

    // Initialize page
    document.addEventListener('DOMContentLoaded', function () {
        // Add smooth scroll behavior
        document.documentElement.style.scrollBehavior = 'smooth';

        // Initialize tooltips
        const tooltips = document.querySelectorAll('[title]');
        tooltips.forEach(el => {
            new bootstrap.Tooltip(el);
        });
    });
    
    // Function to render a single booking card
 function renderBookingCard(request) {
    const skill = request.skillDto;

    const statusClass = {
        CONFIRMED: 'status-confirmed',
        PENDING: 'status-pending',
        COMPLETED: 'status-completed',
        CANCELLED: 'status-cancelled',
        AVAILABLE: 'status-confirmed' // fallback for availability
    };

    // Pick first image
    const imageUrl = skill.imageUrls && skill.imageUrls.length > 0
        ? skill.imageUrls[0]
        : "https://via.placeholder.com/400x250?text=No+Image";

    const actionButtons = `
        <button class="btn-action btn-primary-action" onclick="openBookingModal('${request.skillRequestId}')">
            <i class="fas fa-eye"></i> View Details
        </button>
        ${request.status === 'COMPLETED' ? 
            `<div class="action-icon icon-complete" onclick="showRatingModal('${request.skillRequestId}')" title="Rate Experience">
                <i class="fas fa-star"></i>
            </div>` :
            `<div class="action-icon icon-message" onclick="openChat('${request.skillRequestId}')" title="Message Owner">
                <i class="fas fa-comments"></i>
            </div>
            <div class="action-icon icon-cancel" onclick="showCancelConfirm('${request.skillRequestId}')" title="Cancel Booking">
                <i class="fas fa-times"></i>
            </div>`}
    `;

    return `
        <div class="col-lg-4 col-md-6 booking-item fade-in" data-status="${request.status}">
            <div class="card booking-card">
                <div class="status-indicator ${statusClass[request.status] || ''}">
                    ${request.status}
                </div>
                <img src="${imageUrl}" class="card-img-top" alt="${skill.name}">
                <div class="card-body">
                    <h5 class="card-title">${skill.name}</h5>
                    <p class="location-text"><i class="fas fa-map-marker-alt"></i> No location</p>
                    <div class="date-badge"><i class="fas fa-calendar"></i> ${skill.startDate} - ${skill.endDate}</div>
                    <div class="price-display"><i class="fas fa-dollar-sign"></i> 
                        ${request.price != null ? request.price : (skill.price != null ? skill.price : "FREE")}
                    </div>
                    <p class="message-text"><i class="fas fa-comment"></i> ${request.message || ""}</p>
                    <div class="action-buttons">${actionButtons}</div>
                </div>
            </div>
        </div>
    `;
}


    // Function to load skill bookings
    // Integrated Skill Bookings Manager


// Unified Skill & Tool Bookings Manager
let skillBookings = [];
let toolBookings = [];
let currentFilter = 'all';

// Load both skill and tool bookings
function loadAllBookings() {
    loadSkillBookings();
    loadToolBookings();
}

// Load skill bookings
function loadSkillBookings() {
    const userId = localStorage.getItem("userId");
    
    $.ajax({
        url: 'http://localhost:8080/mybookings/getskillsrequests',
        method: 'GET',
        data: { userId: userId },
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (response) {
            console.log('Skill bookings response:', response);
            
            if (response.data && Array.isArray(response.data)) {
                skillBookings = response.data;
            } else if (response.skillBookings && Array.isArray(response.skillBookings)) {
                skillBookings = response.skillBookings;
            } else {
                skillBookings = [];
            }
            
            renderAllBookings();
            updateFilterCounts();
        },
        error: function(err) {
            console.error('Error fetching skill bookings:', err);
        }
    });
}

// Load tool bookings
function loadToolBookings() {
    const container = $('#skillBookingsContainer');
    const userId = localStorage.getItem("userId");
    
    showLoadingState(container);
    console.log('Fetching tool bookings for userId:', userId);

    $.ajax({
        url: 'http://localhost:8080/mybookings/gettoolsrequests', // Fixed URL
        method: 'GET',
        data: { userId: userId },
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function (response) {
            console.log('Tool bookings response:', response);
            
            if (response.data && Array.isArray(response.data)) {
                toolBookings = response.data;
            } else if (response.toolBookings && Array.isArray(response.toolBookings)) {
                toolBookings = response.toolBookings;
            } else {
                toolBookings = [];
            }
            
            renderAllBookings();
            updateFilterCounts();
        },
        error: function(err) {
            console.error('Error fetching tool bookings:', err);
            showErrorState(container);
        }
    });
}

// Show loading state
function showLoadingState(container) {
    container.html(`
        <div class="col-12 text-center py-5">
            <div class="loading-spinner">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted fs-5">Loading your bookings...</p>
            </div>
        </div>
    `);
}

// Show error state
function showErrorState(container) {
    container.html(`
        <div class="col-12 text-center py-5">
            <div class="error-state">
                <i class="fas fa-exclamation-triangle fa-4x text-warning mb-3"></i>
                <h4>Unable to load bookings</h4>
                <p class="text-muted mb-3">Please check your connection and try again.</p>
                <button class="btn btn-primary btn-lg" onclick="loadAllBookings()">
                    <i class="fas fa-refresh me-2"></i>Retry
                </button>
            </div>
        </div>
    `);
}

// Render all bookings (both skills and tools)
function renderAllBookings() {
    const container = $('#skillBookingsContainer');
    const emptyState = $('#skillEmptyState');
    
    const allBookings = [...skillBookings, ...toolBookings];
    const filteredBookings = getFilteredBookings(allBookings);
    
    if (filteredBookings.length === 0) {
        container.empty();
        emptyState.show();
        return;
    }

    emptyState.hide();
    container.empty();
    
    filteredBookings.forEach((booking, index) => {
        const bookingType = booking.skillDto ? 'skill' : 'tool';
        container.append(createBookingCard(booking, bookingType, index));
    });

    // Add staggered animations
    $('.booking-item').each(function(index) {
        $(this).css('animation-delay', `${index * 0.1}s`);
        $(this).addClass('animate__animated animate__fadeInUp');
    });
}

// Get filtered bookings based on current filter
function getFilteredBookings(allBookings) {
    if (currentFilter === 'all') {
        return allBookings;
    }
    
    const statusMap = {
        'active': ['PENDING', 'CONFIRMED', 'ACCEPTED'],
        'completed': ['COMPLETED'],
        'cancelled': ['CANCELLED', 'REJECTED']
    };

    return allBookings.filter(booking => 
        statusMap[currentFilter]?.includes(booking.status?.toUpperCase())
    );
}

// Create unified booking card for both skills and tools
function createBookingCard(booking, type, index) {
    const item = type === 'skill' ? booking.skillDto : booking.toolDto;
    const statusConfig = getStatusConfig(booking.status);
    
    // Handle image URL
    let imageUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop';
    if (item.imageUrls && item.imageUrls.length > 0) {
        imageUrl = item.imageUrls[0];
    }

    // Format dates
    let dateRange = 'TBA';
    if (type === 'tool') {
        const startDate = booking.borrowStartDate ? new Date(booking.borrowStartDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        }) : null;
        const endDate = booking.borrowEndDate ? new Date(booking.borrowEndDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        }) : null;
        
        if (startDate && endDate) {
            dateRange = startDate !== endDate ? `${startDate} - ${endDate}` : startDate;
        }
    } else {
        const startDate = item.startDate ? new Date(item.startDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        }) : null;
        const endDate = item.endDate ? new Date(item.endDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        }) : null;
        
        if (startDate && endDate) {
            dateRange = startDate !== endDate ? `${startDate} - ${endDate}` : startDate;
        }
    }

    // Format price
    const price = booking.price ? parseFloat(booking.price).toFixed(2) : null;
    
    // Get request ID
    const requestId = type === 'skill' ? booking.skillRequestId : booking.toolRequestId;
    const itemId = type === 'skill' ? booking.skillId : booking.toolId;
    
    // Location info (for tools)
    const location = type === 'tool' && item.state && item.country ? `${item.state}, ${item.country}` : null;
    
    return `
        <div class="col-lg-4 col-md-6 booking-item" data-status="${booking.status?.toLowerCase() || 'unknown'}" data-type="${type}">
            <div class="card booking-card h-100 shadow-sm">
                <!-- Status Badge -->
                <div class="status-indicator ${statusConfig.class}">
                    <i class="${statusConfig.icon} me-1"></i>${statusConfig.label}
                </div>
                
                <!-- Image Container -->
                <div class="card-img-container position-relative">
                    <img src="${imageUrl}" 
                         class="card-img-top" 
                         alt="${item.name || 'Item'}"
                         style="height: 220px; object-fit: cover;"
                         onerror="this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop'">
                    
                    <!-- Type Badge -->
                    <div class="position-absolute top-0 start-0 m-2">
                        <span class="badge ${type === 'skill' ? 'bg-primary' : 'bg-success'} bg-opacity-90">
                            <i class="fas ${type === 'skill' ? 'fa-user-graduate' : 'fa-tools'} me-1"></i>
                            ${type === 'skill' ? 'Skill' : 'Tool'}
                        </span>
                    </div>
                    
                    ${type === 'tool' && item.condition ? `
                        <div class="position-absolute top-0 end-0 m-2" style="right: 60px !important;">
                            <span class="badge bg-info bg-opacity-90">
                                ${item.condition}
                            </span>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Card Body -->
                <div class="card-body d-flex flex-column">
                    <!-- Title -->
                    <h5 class="card-title fw-bold text-dark mb-2">
                        ${item.name || `Unnamed ${type}`}
                    </h5>
                    
                    <!-- Description -->
                    <p class="card-text text-muted small mb-3" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${item.description || 'No description available'}
                    </p>
                    
                    <!-- Location (for tools) -->
                    ${location ? `
                        <div class="mb-2">
                            <small class="text-muted">
                                <i class="fas fa-map-marker-alt me-1"></i>${location}
                            </small>
                        </div>
                    ` : ''}
                    
                    <!-- Details Section -->
                    <div class="booking-details mb-3">
                        <!-- Date Range -->
                        <div class="detail-item mb-2 p-2 bg-light rounded">
                            <i class="fas fa-calendar text-primary me-2"></i>
                            <small class="fw-medium">${dateRange}</small>
                        </div>
                        
                        <!-- Request ID -->
                        <div class="detail-item mb-2 p-2 bg-light rounded">
                            <i class="fas fa-hashtag text-success me-2"></i>
                            <small class="fw-medium">Request #${requestId || 'N/A'}</small>
                        </div>
                        
                        <!-- Price (if available) -->
                        ${price ? `
                            <div class="detail-item mb-2 p-2 bg-light rounded">
                                <i class="fas fa-dollar-sign text-warning me-2"></i>
                                <small class="fw-medium">$${price}</small>
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- Message (if available) -->
                    ${booking.message ? `
                        <div class="booking-message mb-3 p-2 bg-info bg-opacity-10 rounded border-start border-info border-3">
                            <small class="text-muted">
                                <i class="fas fa-comment-dots me-1"></i>
                                <em>"${booking.message}"</em>
                            </small>
                        </div>
                    ` : ''}
                    
                    <!-- Action Buttons -->
                    <div class="mt-auto">
                        <div class="d-flex gap-2 align-items-center">
                            <!-- View Details Button -->
                            <button class="btn btn-primary flex-fill" onclick="viewBookingDetails(${requestId || 0}, '${type}')">
                                <i class="fas fa-eye me-1"></i>Details
                            </button>
                            
                            ${getActionIcons(booking, type, itemId)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Get status configuration
function getStatusConfig(status) {
    const configs = {
        'PENDING': { 
            class: 'status-pending bg-warning text-white', 
            label: 'Pending',
            icon: 'fas fa-clock'
        },
        'CONFIRMED': { 
            class: 'status-confirmed bg-success text-white', 
            label: 'Confirmed',
            icon: 'fas fa-check-circle'
        },
        'ACCEPTED': { 
            class: 'status-confirmed bg-success text-white', 
            label: 'Accepted',
            icon: 'fas fa-check-circle'
        },
        'COMPLETED': { 
            class: 'status-completed bg-primary text-white', 
            label: 'Completed',
            icon: 'fas fa-flag-checkered'
        },
        'CANCELLED': { 
            class: 'status-cancelled bg-danger text-white', 
            label: 'Cancelled',
            icon: 'fas fa-times-circle'
        },
        'REJECTED': { 
            class: 'status-cancelled bg-danger text-white', 
            label: 'Rejected',
            icon: 'fas fa-times-circle'
        }
    };
    return configs[status?.toUpperCase()] || { 
        class: 'status-unknown bg-secondary text-white', 
        label: status || 'Unknown',
        icon: 'fas fa-question-circle'
    };
}

// Get action icons based on booking status and type
function getActionIcons(booking, type, itemId) {
    const status = booking.status?.toUpperCase();
    
    if (status === 'PENDING') {
        return `
            <button class="btn btn-outline-info btn-sm" onclick="contactProvider(${itemId || 0}, '${type}')" title="Contact Provider">
                <i class="fas fa-comments"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="cancelBooking(${booking[type === 'skill' ? 'skillRequestId' : 'toolRequestId'] || 0}, '${type}')" title="Cancel Request">
                <i class="fas fa-times"></i>
            </button>
        `;
    } else if (status === 'CONFIRMED' || status === 'ACCEPTED') {
        return `
            <button class="btn btn-outline-info btn-sm" onclick="contactProvider(${itemId || 0}, '${type}')" title="Contact Provider">
                <i class="fas fa-comments"></i>
            </button>
        `;
    } else if (status === 'COMPLETED') {
        return `
            <button class="btn btn-outline-warning btn-sm" onclick="rateExperience(${booking[type === 'skill' ? 'skillRequestId' : 'toolRequestId'] || 0}, '${type}')" title="Rate Experience">
                <i class="fas fa-star"></i>
            </button>
        `;
    }
    return '';
}

// Update filter tab counts
function updateFilterCounts() {
    const allBookings = [...skillBookings, ...toolBookings];
    
    const counts = {
        all: allBookings.length,
        active: allBookings.filter(b => ['PENDING', 'CONFIRMED', 'ACCEPTED'].includes(b.status?.toUpperCase())).length,
        completed: allBookings.filter(b => b.status?.toUpperCase() === 'COMPLETED').length,
        cancelled: allBookings.filter(b => ['CANCELLED', 'REJECTED'].includes(b.status?.toUpperCase())).length
    };

    Object.keys(counts).forEach(filter => {
        const badge = $(`.filter-tab[data-filter="${filter}"] .badge`);
        if (badge.length) {
            badge.text(counts[filter]);
        }
    });
}

// Filter bookings function
function filterBookings(status) {
    currentFilter = status;
    
    // Update active tab
    $('.filter-tab').removeClass('active');
    $(`.filter-tab[data-filter="${status}"]`).addClass('active');

    // Add loading effect
    const container = $('#skillBookingsContainer');
    container.css('opacity', '0.6');

    setTimeout(() => {
        renderAllBookings();
        container.css('opacity', '1');
    }, 300);
}

// View booking details (unified for both types)
function viewBookingDetails(requestId, type) {
    const bookings = type === 'skill' ? skillBookings : toolBookings;
    const idField = type === 'skill' ? 'skillRequestId' : 'toolRequestId';
    const booking = bookings.find(b => b[idField] == requestId);
    
    if (!booking) {
        Swal.fire('Error', 'Booking not found', 'error');
        return;
    }

    const item = type === 'skill' ? booking.skillDto : booking.toolDto;
    const statusConfig = getStatusConfig(booking.status);
    
    let dateInfo = '';
    if (type === 'tool') {
        dateInfo = `${booking.borrowStartDate || 'TBA'} to ${booking.borrowEndDate || 'TBA'}`;
    } else {
        dateInfo = `${item.startDate || 'TBA'} to ${item.endDate || 'TBA'}`;
    }
    
    Swal.fire({
        title: `<i class="fas ${type === 'skill' ? 'fa-user-graduate' : 'fa-tools'} me-2"></i>${item.name || `${type} Details`}`,
        html: `
            <div class="text-start">
                <div class="row g-3">
                    <div class="col-md-6">
                        <p class="mb-2"><strong><i class="fas fa-info-circle me-2 text-primary"></i>Description:</strong></p>
                        <p class="ms-4 text-muted">${item.description || 'No description provided'}</p>
                    </div>
                    <div class="col-md-6">
                        <p class="mb-2"><strong><i class="fas fa-flag me-2 text-primary"></i>Status:</strong></p>
                        <p class="ms-4"><span class="badge ${statusConfig.class}"><i class="${statusConfig.icon} me-1"></i>${booking.status}</span></p>
                    </div>
                    <div class="col-md-6">
                        <p class="mb-2"><strong><i class="fas fa-calendar me-2 text-primary"></i>${type === 'tool' ? 'Borrow Period' : 'Available Period'}:</strong></p>
                        <p class="ms-4 text-muted">${dateInfo}</p>
                    </div>
                    <div class="col-md-6">
                        <p class="mb-2"><strong><i class="fas fa-hashtag me-2 text-primary"></i>Request ID:</strong></p>
                        <p class="ms-4 text-muted">#${requestId || 'N/A'}</p>
                    </div>
                    ${type === 'tool' && item.condition ? `
                        <div class="col-md-6">
                            <p class="mb-2"><strong><i class="fas fa-wrench me-2 text-primary"></i>Condition:</strong></p>
                            <p class="ms-4"><span class="badge bg-info">${item.condition}</span></p>
                        </div>
                    ` : ''}
                    ${type === 'tool' && item.state && item.country ? `
                        <div class="col-md-6">
                            <p class="mb-2"><strong><i class="fas fa-map-marker-alt me-2 text-primary"></i>Location:</strong></p>
                            <p class="ms-4 text-muted">${item.state}, ${item.country}</p>
                        </div>
                    ` : ''}
                    ${booking.price ? `
                        <div class="col-md-6">
                            <p class="mb-2"><strong><i class="fas fa-dollar-sign me-2 text-primary"></i>Price:</strong></p>
                            <p class="ms-4 text-success fw-bold">$${parseFloat(booking.price).toFixed(2)}</p>
                        </div>
                    ` : ''}
                    ${booking.message ? `
                        <div class="col-12">
                            <p class="mb-2"><strong><i class="fas fa-comment me-2 text-primary"></i>Your Message:</strong></p>
                            <div class="ms-4 p-3 bg-light rounded">
                                <em>"${booking.message}"</em>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `,
        width: 700,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-comments me-2"></i>Contact Provider',
        cancelButtonText: 'Close',
        customClass: {
            confirmButton: 'btn btn-primary me-2',
            cancelButton: 'btn btn-outline-secondary'
        },
        buttonsStyling: false
    }).then((result) => {
        if (result.isConfirmed) {
            const itemId = type === 'skill' ? booking.skillId : booking.toolId;
            contactProvider(itemId, type);
        }
    });
}

// Contact provider (unified)
function contactProvider(itemId, type) {
    Swal.fire({
        title: 'Contact Provider',
        text: 'Opening message interface...',
        icon: 'info',
        timer: 1500,
        showConfirmButton: false
    });
    
    setTimeout(() => {
        window.location.href = `/pages/messages.html?${type}Id=${itemId}`;
    }, 1500);
}

// Cancel booking (unified)
function cancelBooking(requestId, type) {
    Swal.fire({
        title: 'Cancel Booking Request?',
        text: 'Are you sure you want to cancel this booking request? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, cancel it!',
        cancelButtonText: 'Keep it'
    }).then((result) => {
        if (result.isConfirmed) {
            // Show loading
            Swal.fire({
                title: 'Cancelling...',
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                }
            });

            // API call to cancel booking
            setTimeout(() => {
                Swal.fire({
                    title: 'Cancelled!',
                    text: 'Your booking request has been cancelled.',
                    icon: 'success',
                    timer: 2000
                });
                
                // Refresh bookings
                loadAllBookings();
            }, 1500);
        }
    });
}

// Rate experience (unified)
function rateExperience(requestId, type) {
    let selectedRating = 0;
    
    Swal.fire({
        title: `Rate Your ${type === 'skill' ? 'Skill' : 'Tool'} Experience`,
        html: `
            <div class="mb-3">
                <p class="mb-3">How was your experience with this ${type} provider?</p>
                <div class="rating-stars d-flex justify-content-center mb-3" style="font-size: 2rem; gap: 5px;">
                    ${[1,2,3,4,5].map(i => 
                        `<i class="fas fa-star rating-star" data-rating="${i}" style="color: #ddd; cursor: pointer;"></i>`
                    ).join('')}
                </div>
            </div>
            <textarea class="form-control" id="reviewText" placeholder="Share your experience (optional)" rows="3"></textarea>
        `,
        showCancelButton: true,
        confirmButtonText: 'Submit Rating',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
            const reviewText = document.getElementById('reviewText').value;
            
            if (selectedRating === 0) {
                Swal.showValidationMessage('Please select a rating');
                return false;
            }
            
            return { rating: selectedRating, review: reviewText };
        },
        didOpen: () => {
            // Rating stars interaction
            const stars = document.querySelectorAll('.rating-star');
            stars.forEach((star, index) => {
                star.addEventListener('click', () => {
                    selectedRating = index + 1;
                    updateStarsDisplay(stars, selectedRating);
                });
                
                star.addEventListener('mouseover', () => {
                    updateStarsDisplay(stars, index + 1);
                });
            });
            
            document.querySelector('.rating-stars').addEventListener('mouseleave', () => {
                updateStarsDisplay(stars, selectedRating);
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Thank you!',
                text: 'Your rating has been submitted.',
                icon: 'success',
                timer: 2000
            });
        }
    });
}

// Helper function to update stars display
function updateStarsDisplay(stars, rating) {
    stars.forEach((star, index) => {
        star.style.color = index < rating ? '#ffc107' : '#ddd';
    });
}

// Initialize on page load
$(document).ready(function() {
    loadAllBookings();
    
    // Setup filter tab click handlers
    $('.filter-tab').on('click', function() {
        const filter = $(this).data('filter');
        filterBookings(filter);
    });
});