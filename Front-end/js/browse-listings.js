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