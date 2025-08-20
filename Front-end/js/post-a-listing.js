$(document).ready(function () {
    let uploadedImages = [];

    function renderPreview() {
        let previewContainer = $('#imagePreviewContainer');
        previewContainer.empty();

        // Show up to 4 images
        uploadedImages.slice(0, 4).forEach(imgSrc => {
            previewContainer.append(`<img src="${imgSrc}" class="image-thumbnail">`);
        });

        // If more than 4 images, show "+x" indicator
        if (uploadedImages.length > 4) {
            previewContainer.append(`<div class="more-images">+${uploadedImages.length - 4}</div>`);
        }

        // Add upload box if less than 4 images
        if (uploadedImages.length < 4) {
            previewContainer.append(`
                <label class="image-upload-box">
                    <i class="bi bi-plus"></i>
                    <input type="file" id="listingImage" accept="image/*" hidden>
                </label>
            `);
        }
    }


    // Handle file selection
    $(document).on('change', '#listingImage', function (e) {
        let files = Array.from(e.target.files);

        files.forEach(file => {
            let reader = new FileReader();
            reader.onload = function (event) {
                uploadedImages.push(event.target.result);
                renderPreview();
            }
            reader.readAsDataURL(file);
        });
    });

    renderPreview(); // Initial state
});

$(document).ready(function () {
    $('input[name="availabilityType"]').on('change', function () {
        if ($(this).val() === 'time') {
            $('#timeFields').removeClass('d-none');
            $('#dateFields').addClass('d-none');
        } else {
            $('#timeFields').addClass('d-none');
            $('#dateFields').removeClass('d-none');
        }
    });

    // Form submission validation
    $('#createListingForm').on('submit', function (e) {
        e.preventDefault();

        let type = $('input[name="availabilityType"]:checked').val();
        let valid = true;
        let message = "";

        if (type === 'time') {
            let date = $('#timeDate').val();
            let start = $('#startTime').val();
            let end = $('#endTime').val();
            if (!date || !start || !end) {
                valid = false;
                message = "Please select a date, start time, and end time.";
            }
        } else {
            let startDate = $('#startDate').val();
            let endDate = $('#endDate').val();
            if (!startDate || !endDate) {
                valid = false;
                message = "Please select both start and end dates.";
            }
        }

        if (!valid) {
            alert(message);
            return;
        }

        // ✅ Submit data
        alert("Form submitted successfully!");
    });
});

// Open Edit Modal and populate fields
function openEditModal(listing) {
    $('#editListingTitle').val(listing.title);
    $('#editListingDescription').val(listing.description);
    $('#editListingLocation').val(listing.location);
    $('#editListingPriceHour').val(listing.priceHour);
    $('#editListingPriceDay').val(listing.priceDay);
    $('#editListingCategory').val(listing.category);
    $('#editListingCondition').val(listing.condition);

    // Populate availability
    if(listing.availabilityType === 'time') {
        $('#editTimeOption').prop('checked', true);
        $('#editTimeFields').removeClass('d-none');
        $('#editDateFields').addClass('d-none');
        $('#editTimeDate').val(listing.date);
        $('#editStartTime').val(listing.startTime);
        $('#editEndTime').val(listing.endTime);
    } else {
        $('#editDateOption').prop('checked', true);
        $('#editDateFields').removeClass('d-none');
        $('#editTimeFields').addClass('d-none');
        $('#editStartDate').val(listing.startDate);
        $('#editEndDate').val(listing.endDate);
    }

    // Populate images
    const container = $('#editImagePreviewContainer');
    container.empty();
    listing.images.forEach((img, index) => {
        const imgBox = $(`
            <div class="position-relative">
                <img src="${img}" class="image-thumbnail">
                <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 remove-image">&times;</button>
            </div>
        `);
        container.append(imgBox);
        // Remove image on click
        imgBox.find('.remove-image').click(() => imgBox.remove());
    });

    // Show modal
    $('#editListingModal').modal('show');
}

// Toggle time/date fields
$('input[name="editAvailabilityType"]').change(function(){
    if($('#editTimeOption').is(':checked')){
        $('#editTimeFields').removeClass('d-none');
        $('#editDateFields').addClass('d-none');
    } else {
        $('#editDateFields').removeClass('d-none');
        $('#editTimeFields').addClass('d-none');
    }
});

// Handle new image uploads
$('#editListingImage').change(function(e){
    const container = $('#editImagePreviewContainer');
    Array.from(this.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(event){
            const imgBox = $(`
                <div class="position-relative">
                    <img src="${event.target.result}" class="image-thumbnail">
                    <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 remove-image">&times;</button>
                </div>
            `);
            container.append(imgBox);
            imgBox.find('.remove-image').click(() => imgBox.remove());
        };
        reader.readAsDataURL(file);
    });
});

$(document).ready(function(){

    // When Edit button is clicked
    $('.edit-btn').click(function(){
        const btn = $(this);

        // Extract data
        const listing = {
            title: btn.data('title'),
            description: btn.data('description'),
            location: btn.data('location'),
            priceHour: btn.data('pricehour'),
            priceDay: btn.data('priceday'),
            category: btn.data('category'),
            condition: btn.data('condition'),
            availabilityType: btn.data('availabilitytype'),
            startDate: btn.data('startdate'),
            endDate: btn.data('enddate'),
            date: btn.data('date'),
            startTime: btn.data('starttime'),
            endTime: btn.data('endtime'),
            images: btn.data('images')
        };

        // Populate form
        $('#editListingTitle').val(listing.title);
        $('#editListingDescription').val(listing.description);
        $('#editListingLocation').val(listing.location);
        $('#editListingPriceHour').val(listing.priceHour);
        $('#editListingPriceDay').val(listing.priceDay);
        $('#editListingCategory').val(listing.category);
        $('#editListingCondition').val(listing.condition);

        // Populate availability fields
        if(listing.availabilityType === 'time'){
            $('#editTimeOption').prop('checked', true);
            $('#editTimeFields').removeClass('d-none');
            $('#editDateFields').addClass('d-none');
            $('#editTimeDate').val(listing.date);
            $('#editStartTime').val(listing.startTime);
            $('#editEndTime').val(listing.endTime);
        } else {
            $('#editDateOption').prop('checked', true);
            $('#editDateFields').removeClass('d-none');
            $('#editTimeFields').addClass('d-none');
            $('#editStartDate').val(listing.startDate);
            $('#editEndDate').val(listing.endDate);
        }

        // Populate images
        const container = $('#editImagePreviewContainer');
        container.empty();
        if(listing.images){
            listing.images.forEach(img => {
                const imgBox = $(`
                    <div class="position-relative">
                        <img src="${img}" class="image-thumbnail">
                        <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 remove-image">&times;</button>
                    </div>
                `);
                container.append(imgBox);
                imgBox.find('.remove-image').click(()=> imgBox.remove());
            });
        }

        // Show the modal
        $('#editListingModal').modal('show');
    });

});

