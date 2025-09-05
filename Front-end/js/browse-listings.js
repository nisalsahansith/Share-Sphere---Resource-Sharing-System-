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
    const userId = $("#listingModal").data("userId"); 
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
