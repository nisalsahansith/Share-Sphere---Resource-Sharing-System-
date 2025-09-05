$(document).ready(function () {
    let userId = localStorage.getItem("userId")
    let token = localStorage.getItem("token")

    $.ajax({
    url: 'http://localhost:8080/mybookings/getmybookings',
    method: 'GET',
    data: { "userId": userId },
    headers: {
        "Authorization": "Bearer " + token
    },
    success: function(response) {
        const bookings = response.data;
        const skillContainer = $('#skillBookingsContainer');
        const toolContainer = $('#toolBookingsContainer');

        bookings.forEach(booking => {
            const card = $(`
                <div class="col-md-6 col-lg-4">
                    <div class="card shadow-sm h-100">
                        <div class="card-body">
                            <h5 class="card-title">${booking.type} Booking #${booking.exchangeId}</h5>
                            <p class="card-text mb-1"><strong>Giver:</strong> ${booking.giverId}</p>
                            <p class="card-text mb-1"><strong>Receiver:</strong> ${booking.receiverId}</p>
                            <p class="card-text mb-1"><strong>Start:</strong> ${booking.startTime ?? 'N/A'}</p>
                            <p class="card-text mb-1"><strong>End:</strong> ${booking.endTime ?? 'N/A'}</p>
                            ${booking.paymentId ? `<p class="card-text"><strong>Payment ID:</strong> ${booking.paymentId}</p>` 
                                                : `<button class="btn btn-primary pay-btn" data-id="${booking.exchangeId}">Pay Now</button>`}
                        </div>
                    </div>
                </div>
            `);

            if (booking.type === 'SKILL') {
                skillContainer.append(card);
            } else if (booking.type === 'TOOL') {
                toolContainer.append(card);
            }
        });

        // Optional: show message if no bookings
        if (!skillContainer.children().length) {
            skillContainer.html('<p class="text-muted">No skill bookings found.</p>');
        }
        if (!toolContainer.children().length) {
            toolContainer.html('<p class="text-muted">No tool bookings found.</p>');
        }

        // Handle Pay Now button click
        $('.pay-btn').click(function() {
            const exchangeId = $(this).data('id');
            // Example: Redirect to payment page or trigger payment API
            alert('Redirect to payment for Exchange ID: ' + exchangeId);
            // You can replace alert with actual payment logic
        });
    },
    error: function(err) {
        console.error('Error fetching bookings:', err);
    }
});

});
