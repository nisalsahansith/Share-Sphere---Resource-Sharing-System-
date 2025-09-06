$(document).ready(function () {
    let userId = localStorage.getItem("userId");
    let token = localStorage.getItem("token");

    // Fetch bookings from backend
    $.ajax({
        url: 'http://localhost:8080/mybookings/getmybookings',
        method: 'GET',
        data: { userId: userId },
        headers: { "Authorization": "Bearer " + token },
        success: function (response) {
            const bookings = response.data || [];
            const skillContainer = $('#skillBookingsContainer');
            const toolContainer = $('#toolBookingsContainer');

            skillContainer.empty();
            toolContainer.empty();

            if (!bookings.length) {
                skillContainer.html('<p class="text-muted">No skill bookings found.</p>');
                toolContainer.html('<p class="text-muted">No tool bookings found.</p>');
                return;
            }

            // Sort bookings by latest exchangeId
            bookings.sort((a, b) => b.exchangeId - a.exchangeId);

            // Render cards into correct section
            bookings.forEach((booking, index) => {
                setTimeout(() => {
                    const card = generateBookingCard(booking);

                    if (booking.type && booking.type.toLowerCase() === 'skill') {
                        skillContainer.append(card);
                    } else if (booking.type && booking.type.toLowerCase() === 'tool') {
                        toolContainer.append(card);
                    }
                }, index * 150); // stagger animation
            });
        },
        error: function (err) {
            console.error('Error fetching bookings:', err);
        }
    });

//     // Handle Pay Now click
//     $(document).on('click', '.btn-pay-now', function () {
//         const exchangeId = $(this).data('id');
//         const button = $(this);

//         button.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Processing...');

//         // Simulate payment API
//         setTimeout(() => {
//             showPaymentSuccess(exchangeId);
//             updateCardAfterPayment(
//                 exchangeId,
//                 'PAY_' + Math.random().toString(36).substr(2, 9).toUpperCase()
//             );
//         }, 2000);
//     });
});

/* ===============================
   🔹 Card Generator (same as before)
   =============================== */
function generateBookingCard(booking) {
    const statusClasses = {
        'pending': 'status-pending',
        'confirmed': 'status-confirmed',
        'completed': 'status-completed',
        'cancelled': 'status-cancelled'
    };

    const statusIcons = {
        'pending': 'fas fa-clock',
        'confirmed': 'fas fa-check-circle',
        'completed': 'fas fa-star',
        'cancelled': 'fas fa-times-circle'
    };

    const typeClass = booking.type.toLowerCase() === 'skill' ? 'type-skill' : 'type-tool';
    const typeIcon = booking.type.toLowerCase() === 'skill' ? 'fas fa-user-graduate' : 'fas fa-tools';

    const now = new Date();
    const startDate = booking.startTime ? new Date(booking.startTime) : null;
    const timeRemaining = startDate && startDate > now
        ? Math.ceil((startDate - now) / (1000 * 60 * 60 * 24))
        : 0;

    // Get images array
    let images = [];
    if (booking.skillRequestDto && booking.skillRequestDto.skillDto?.imageUrls) {
        images = booking.skillRequestDto.skillDto.imageUrls;
    } else if (booking.toolRequestDto && booking.toolRequestDto.toolDto?.imageUrls) {
        images = booking.toolRequestDto.toolDto.imageUrls;
    }

    // Render images
    const imageHtml = generateImageGallery(images, booking.exchangeId);
    
    // Get price
        let price = null;
        if (booking.skillRequestDto?.price) {
            price = booking.skillRequestDto?.price;
        } else if (booking.toolRequestDto?.price) {
            price = booking.toolRequestDto.price; // Use booking.toolRequestDto.price first
        }


    const card = $(`
        <div class="col-lg-4 col-md-6">
            <div class="booking-card fade-in-card"
                 data-booking-id="${booking.exchangeId}"
                 data-status="${booking.status}"
                 data-receiver-id="${booking.receiverId}">

                <!-- Header -->
                <div class="booking-header">
                    <div class="booking-id">Booking #${booking.exchangeId}</div>
                    <h3 class="booking-title">${booking.title || booking.type + " Service"}</h3>
                    <div class="booking-type-badge ${typeClass}">
                        <i class="${typeIcon} me-2"></i>${booking.type}
                    </div>
                </div>

                <!-- Body -->
                <div class="booking-body">
                    <!-- Status -->
                    <div class="status-indicator ${statusClasses[booking.status]}">
                        <i class="${statusIcons[booking.status]}"></i>
                        ${booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending'}
                    </div>

                    <!-- Images -->
                    ${imageHtml}

                    <!-- Description -->
                    <p class="booking-description">${booking.skillRequestDto?.message || booking.toolRequestDto?.message || 'No description available.'}</p>

                    ${price !== null ? `
                        <div class="booking-price" data-price="${price}>
                            <strong>Price:</strong> $${price}
                        </div>
                    ` : ''}

                    <!-- Countdown -->
                    ${booking.status === 'confirmed' && timeRemaining > 0 ? `
                        <div class="time-remaining">
                            <div class="time-remaining-label">Starts In</div>
                            <div class="time-remaining-value">${timeRemaining} Day${timeRemaining !== 1 ? 's' : ''}</div>
                        </div>
                    ` : ''}

                    <!-- Info -->
                    <div class="booking-info">
                        <div class="info-item">
                            <i class="fas fa-user me-2"></i>
                            <span><strong>Provider:</strong> ${booking.giverId}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-calendar-start me-2"></i>
                            <span><strong>Start:</strong> ${booking.startTime || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-calendar-check me-2"></i>
                            <span><strong>End:</strong> ${booking.endTime || 'N/A'}</span>
                        </div>
                    </div>

                    <!-- Payment / Actions -->
                    ${booking.paymentId ? `
                        <div class="payment-section">
                            <div class="payment-success">
                                <i class="fas fa-check-circle"></i>
                                <div>
                                    <div style="font-weight:700;margin-bottom:0.2rem;">Payment Completed</div>
                                    <div style="font-size:0.85rem;opacity:0.8;">Transaction secured</div>
                                </div>
                                <div class="payment-id">${booking.paymentId}</div>
                            </div>
                        </div>
                    ` : booking.status !== 'cancelled' && booking.status !== 'completed' ? `
                        <div class="booking-actions">
                            <button class="btn-pay-now pulse-payment" data-id="${booking.exchangeId}">
                                <i class="fas fa-credit-card me-2"></i>Pay Now
                            </button>
                            <button class="btn-secondary-action" onclick="contactProvider(${booking.exchangeId})">
                                <i class="fas fa-message me-2"></i>Contact
                            </button>
                        </div>
                    ` : ''}

                    ${booking.status === 'completed' ? `
                        <div class="booking-actions">
                            <button class="btn-secondary-action" onclick="rateBooking(${booking.exchangeId})">
                                <i class="fas fa-star me-2"></i>Rate & Review
                            </button>
                            <button class="btn-secondary-action" onclick="rebookService(${booking.exchangeId})">
                                <i class="fas fa-repeat me-2"></i>Book Again
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `);

    return card;
}

/* ===============================
   🔹 Payment + Notifications
   =============================== */
function showPaymentSuccess(exchangeId) {
    const toast = $(`
        <div class="position-fixed top-0 end-0 p-3" style="z-index:11000;">
            <div class="toast show" role="alert">
                <div class="toast-header bg-success text-white">
                    <i class="fas fa-check-circle me-2"></i>
                    <strong class="me-auto">Payment Successful</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    Payment for Booking #${exchangeId} processed successfully!
                </div>
            </div>
        </div>
    `);

    $('body').append(toast);

    setTimeout(() => {
        toast.fadeOut(() => toast.remove());
    }, 5000);
}

function updateCardAfterPayment(exchangeId, paymentId) {
    const card = $(`.booking-card[data-booking-id="${exchangeId}"]`);
    const actionsSection = card.find('.booking-actions');

    const paymentSection = $(`
        <div class="payment-section animate__animated animate__fadeIn">
            <div class="payment-success">
                <i class="fas fa-check-circle"></i>
                <div>
                    <div style="font-weight:700;margin-bottom:0.2rem;">Payment Completed</div>
                    <div style="font-size:0.85rem;opacity:0.8;">Transaction secured</div>
                </div>
                <div class="payment-id">${paymentId}</div>
            </div>
        </div>
    `);

    actionsSection.fadeOut(300, function () {
        $(this).replaceWith(paymentSection);
    });

    const statusIndicator = card.find('.status-indicator');
    statusIndicator.removeClass('status-pending').addClass('status-confirmed')
        .html('<i class="fas fa-check-circle"></i>Confirmed');
}

/* ===============================
   🔹 Extra Actions
   =============================== */
function contactProvider(exchangeId) {
    alert(`Contact provider for booking #${exchangeId}`);
}
function rateBooking(exchangeId) {
    alert(`Rate booking #${exchangeId}`);
}
function rebookService(exchangeId) {
    alert(`Rebook service for booking #${exchangeId}`);
}

// Generate image gallery with horizontal slider
function generateImageGallery(images, exchangeId) {
    if (!images || images.length === 0) {
        return `
            <div class="no-image-placeholder">
                <i class="fas fa-image"></i>
                <span>No Images Available</span>
            </div>
        `;
    }

    const showArrows = images.length > 1;
    const imageElements = images.map((url, index) => `
        <div class="booking-thumb-wrapper">
            <img src="${url}" class="booking-thumb" alt="Image ${index + 1}" onclick="openImageModal('${url}')">
        </div>
    `).join('');

    return `
        <div class="booking-images" style="position:relative; overflow:hidden;">
            ${showArrows ? `<div class="slider-arrow left" onclick="scrollGalleryLeft(${exchangeId})"><i class="fas fa-chevron-left"></i></div>` : ''}
            <div class="image-gallery-slider" id="gallery-${exchangeId}" style="display:flex; transition: transform 0.4s ease;">
                ${imageElements}
            </div>
            ${showArrows ? `<div class="slider-arrow right" onclick="scrollGalleryRight(${exchangeId})"><i class="fas fa-chevron-right"></i></div>` : ''}
        </div>
    `;
}

function scrollGalleryLeft(id) {
    const gallery = document.getElementById(`gallery-${id}`);
    const width = gallery.clientWidth; // full width of one image
    gallery.scrollBy({ left: -width, behavior: 'smooth' });
}

function scrollGalleryRight(id) {
    const gallery = document.getElementById(`gallery-${id}`);
    const width = gallery.clientWidth; // full width of one image
    gallery.scrollBy({ left: width, behavior: 'smooth' });
}

// Render all bookings
$(document).ready(function () {
    const container = $('#bookingsContainer');
    apiBookingsData.forEach(booking => {
        const card = generateBookingCard(booking);
        container.append(card);
    });
});


$(document).on('click', '.btn-pay-now', function () {
    const exchangeId = $(this).data('id');

    // Get the card
    const card = $(`.booking-card[data-booking-id="${exchangeId}"]`);

    // Read the price from the booking-price div
    let price = parseFloat(card.find('.booking-price').data('price') || 0);

    // Update modal
    $('#paymentAmount').text('$' + price.toFixed(2));
    $('#paymentBookingId').text(exchangeId);
    $('#payHereButton').data('id', exchangeId);

    // Show modal
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    paymentModal.show();
});


$(document).on('click', '#payHereButton', function () {
    const exchangeId = $(this).data('id');
    const amount = parseFloat($('#paymentAmount').text().replace('$', ''));
    const receiverId = $(`.booking-card[data-booking-id="${exchangeId}"]`).data('receiver-id');
    console.log("RECIEVER", receiverId)
    const token = localStorage.getItem("token")

    // Construct the payment payload
    const paymentData = {
        payerId: localStorage.getItem('userId'), // logged-in user
        receiverId: receiverId, // replace with actual receiver
        exchangeId: exchangeId.toString(),
        amount: amount,
        paymentMethod: "CARD",
        paymentStatus: "COMPLETED",
        paymentDate: new Date().toISOString(),
        transactionId: "TRX" + Math.floor(Math.random() * 1000000000) 
    };

    $.ajax({
        url: "http://localhost:8080/mybookings/paymentdone",
        method: "POST",
        contentType: "application/json",
        headers: { "Authorization": "Bearer " + token },
        data: JSON.stringify(paymentData),
        success: function (response) {
            // SweetAlert success
            Swal.fire({
                icon: 'success',
                title: 'Payment Done',
                text: `Payment for Booking #${exchangeId} was successful!`,
                timer: 2000,
                showConfirmButton: false
            });

            // Optionally update UI after 2 seconds
            setTimeout(() => {
                // Example: mark card as paid
                const card = $(`.booking-card[data-booking-id="${exchangeId}"]`);
                card.find('.booking-actions').html(`
                    <div class="payment-section">
                        <div class="payment-success">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <div style="font-weight:700;margin-bottom:0.2rem;">Payment Completed</div>
                                <div style="font-size:0.85rem;opacity:0.8;">Transaction secured</div>
                            </div>
                            <div class="payment-id">${paymentData.transactionId}</div>
                        </div>
                    </div>
                `);
            }, 2000);
        },
        error: function (err) {
            console.error('Payment error:', err);
            Swal.fire({
                icon: 'error',
                title: 'Payment Failed',
                text: 'Something went wrong. Please try again.',
            });
        }
    });

    // const exchangeId = $(this).data('id');

    // // Get the card
    // const card = $(`.booking-card[data-booking-id="${exchangeId}"]`);

    // // Read the price from the booking-price div
    // let price = parseFloat(card.find('.booking-price').data('price') || 0);

    // // Create PayHere payment object
    // var payment = {
    //     sandbox: true, // Set to false in production
    //     merchant_id: "1231936", // Replace with your sandbox merchant ID
    //     return_url: "http://localhost:8080/payment-success",
    //     cancel_url: "http://localhost:8080/payment-cancel",
    //     notify_url: "http://localhost:8080/payment-notify",
    //     order_id: exchangeId,
    //     items: "Booking Payment",
    //     amount: price,
    //     currency: "USD",
    //     first_name: "John",    // you can dynamically fill from user
    //     last_name: "Doe",
    //     email: "john@example.com",
    //     phone: "0771234567",
    //     address: "Galle",
    //     city: "Galle",
    //     country: "Sri Lanka"
    // };

    // // Start PayHere payment
    // payhere.startPayment(payment);
});

payhere.onCompleted = function onCompleted(orderId) {
    // Payment completed. Update UI accordingly
    showPaymentSuccess(orderId);
    updateCardAfterPayment(orderId, "PAY_" + Math.random().toString(36).substr(2,9).toUpperCase());
};

payhere.onDismissed = function onDismissed() {
    // Payment popup closed
    alert("Payment was cancelled.");
    showPaymentSuccess(orderId);
    updateCardAfterPayment(orderId, "PAY_" + Math.random().toString(36).substr(2,9).toUpperCase());
};

payhere.onError = function onError(error) {
    // Some error occurred
    alert("Payment error: " + error);
    showPaymentSuccess(orderId);
    updateCardAfterPayment(orderId, "PAY_" + Math.random().toString(36).substr(2,9).toUpperCase());
};
