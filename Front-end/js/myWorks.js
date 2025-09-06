$(document).ready(function () {
    const userId = localStorage.getItem("userId"); // adjust if needed
    const token = localStorage.getItem("token")

    $.ajax({
        url: `http://localhost:8080/myworks/getmyworks?userId=${userId}`,
        method: "GET",
        headers: { "Authorization": "Bearer " + token },
        success: function (response) {
            if (response.code === 200 && response.data) {
                renderMyWorks(response.data);
            } else {
                $("#myWorksContainer").html("<p class='text-muted'>No works found.</p>");
            }
        },
        error: function () {
            $("#myWorksContainer").html("<p class='text-danger'>Failed to load your works.</p>");
        }
    });

    function renderMyWorks(data) {
        let content = "";

        // Sort by exchangeId (newest first)
        data.sort((a, b) => b.exchangeId - a.exchangeId);

        
        data.forEach(work => {
            const isPaid = work.paymentId ? true : false;

            // Action buttons on card
            const actionButton = isPaid 
                ? `<button class="btn btn-sm btn-success" disabled>
                       <i class="fas fa-check"></i> Done
                   </button>`
                : `<button class="btn btn-sm btn-danger" onclick="rejectWork(${work.exchangeId})">
                       <i class="fas fa-times"></i> Reject
                   </button>`;

            const type = work.type;
            let title = "", description = "", images = [], price = 0, message = "", paymentId = null;

            if (type === "TOOL" && work.toolRequestDto) {
                title = work.toolRequestDto.toolDto?.name || "Unnamed Tool";
                description = work.toolRequestDto.toolDto?.description || "";
                images = work.toolRequestDto.toolDto?.imageUrls || [];
                price = work.toolRequestDto.price || 0;
                message = work.toolRequestDto.message || "";
                paymentId = work.toolRequestDto.paymentId || work.paymentId || null;
            } else if (type === "SKILL" && work.skillRequestDto) {
                title = work.skillRequestDto.skillDto?.name || "Unnamed Skill";
                description = work.skillRequestDto.skillDto?.description || "";
                images = work.skillRequestDto.skillDto?.imageUrls || [];
                price = work.skillRequestDto.price || 0;
                message = work.skillRequestDto.message || "";
                paymentId = work.skillRequestDto.paymentId || work.paymentId || null;
            }
            
            content += `
                <div class="col-md-6 col-lg-4 fade-in">
                    <div class="card booking-card shadow-sm h-100">
                        <div class="booking-images">
                            ${generateImageGallery(images, work.exchangeId)}
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${title}</h5>
                            <p class="card-text text-muted">${description}</p>
                            <p><strong>Message:</strong> ${message}</p>
                            <p><strong>Type:</strong> ${type}</p>
                            <p class="booking-price"><strong>Price:</strong> $${price.toFixed(2)}</p>
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-sm btn-outline-primary" onclick="openDetailsModal(${work.exchangeId}, '${title}', '${message}', ${price}, '${paymentId}')">
                                    <i class="fas fa-eye"></i> View
                                </button>
                                ${actionButton}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        $("#myWorksContainer").html(`<div class="row g-4">${content}</div>`);
    }
});

// Image gallery generator
function generateImageGallery(images, exchangeId) {
    if (!images || images.length === 0) {
        return `
            <div class="no-image-placeholder text-center p-4 text-muted">
                <i class="fas fa-image fa-2x mb-2"></i>
                <p>No Images</p>
            </div>
        `;
    }

    const showArrows = images.length > 1;
    const imageElements = images.map((url, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${url}" class="d-block w-100 booking-frame" alt="Image ${index + 1}">
        </div>
    `).join('');

    
    return `
        <div id="carousel-${exchangeId}" class="carousel slide booking-carousel" data-bs-ride="carousel">
            <div class="carousel-inner">
                ${imageElements}
            </div>
            ${showArrows ? `
            <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${exchangeId}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carousel-${exchangeId}" data-bs-slide="next">
                <span class="carousel-control-next-icon"></span>
            </button>` : ''}
        </div>
    `;
}

function scrollGalleryLeft(id) {
    const gallery = document.getElementById(`gallery-${id}`);
    gallery.scrollBy({ left: -220, behavior: 'smooth' });
}

function scrollGalleryRight(id) {
    const gallery = document.getElementById(`gallery-${id}`);
    gallery.scrollBy({ left: 220, behavior: 'smooth' });
}

// Open details modal
function openDetailsModal(exchangeId, title, message, price, paymentId) {
            const isPaid = paymentId ? true : false;
            const isOverdue = !isPaid && Math.random() > 0.5; // Simulated overdue status
            
            // Determine status and styling
            let statusClass = isPaid ? 'badge-paid' : 'badge-unpaid';
    let statusIcon = isPaid ? 'fas fa-check-circle' : 'fas fa-clock';
    let statusText = isPaid ? 'Complete' : 'Pending';

            // Create the enhanced header
            const headerHtml = `
                <div class="modal-title-main">
                    <div class="modal-title-icon">
                        <i class="fas fa-file-invoice-dollar"></i>
                    </div>
                    <h4 class="modal-title-text">${title}</h4>
                </div>
                <div class="modal-actions">
                    <div class="status-badge ${statusClass}">
                        <i class="${statusIcon}"></i>
                        ${statusText}
                    </div>
                    <button class="btn-modal-action btn-chat" onclick="openChat('${exchangeId}')">
                        <i class="fas fa-comments me-2"></i>Chat
                    </button>
                    <button type="button" class="btn-close-custom" data-bs-dismiss="modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            // Create the enhanced body with better visual hierarchy
            const bodyHtml = `
                <div class="details-card">
                    <div class="card-body p-0">
                        <div class="details-grid">
                            <!-- Description Section -->
                            <div class="detail-section fade-in">
                                <div class="detail-header">
                                    <div class="detail-icon">
                                        <i class="fas fa-align-left"></i>
                                    </div>
                                    <h5 class="detail-label">Requester Message</h5>
                                </div>
                                <div class="detail-content">
                                    <p class="detail-text">${message}</p>
                                </div>
                            </div>

                            <!-- Price Section -->
                            <div class="detail-section fade-in" style="animation-delay: 0.1s;">
                                <div class="detail-header">
                                    <div class="detail-icon">
                                        <i class="fas fa-dollar-sign"></i>
                                    </div>
                                    <h5 class="detail-label">Project Value</h5>
                                </div>
                                <div class="detail-content text-center">
                                    <p class="price-display">
                                        <span class="price-currency">$</span>${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>

                            <!-- Status Timeline -->
                            <div class="detail-section fade-in" style="animation-delay: 0.2s;">
                                <div class="detail-header">
                                    <div class="detail-icon">
                                        <i class="fas fa-tasks"></i>
                                    </div>
                                    <h5 class="detail-label">Payment Status</h5>
                                </div>
                                <div class="status-timeline">
                                    <div class="timeline-step ${!isPaid && !isOverdue ? 'pending' : 'active'}">
                                        <div class="timeline-icon">
                                            <i class="fas fa-file-contract"></i>
                                        </div>
                                        <span class="timeline-label">Contract</span>
                                    </div>
                                    <div class="timeline-step ${isPaid ? 'active' : isOverdue ? 'pending' : 'inactive'}">
                                        <div class="timeline-icon">
                                            <i class="fas fa-credit-card"></i>
                                        </div>
                                        <span class="timeline-label">Payment</span>
                                    </div>
                                    <div class="timeline-step ${isPaid ? 'active' : 'inactive'}">
                                        <div class="timeline-icon">
                                            <i class="fas fa-check-double"></i>
                                        </div>
                                        <span class="timeline-label">Complete</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Additional Details -->
                            <div class="detail-section fade-in" style="animation-delay: 0.3s;">
                                <div class="detail-header">
                                    <div class="detail-icon">
                                        <i class="fas fa-info-circle"></i>
                                    </div>
                                    <h5 class="detail-label">Transaction Details</h5>
                                </div>
                                <div class="detail-content">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <small class="text-muted d-block">Exchange ID</small>
                                            <strong>#${exchangeId}</strong>
                                        </div>
                                        <div class="col-md-6">
                                            <small class="text-muted d-block">Payment ID</small>
                                            <strong>${paymentId || 'Pending'}</strong>
                                        </div>
                                        <div class="col-md-6">
                                            <small class="text-muted d-block">Created</small>
                                            <strong>${new Date().toLocaleDateString()}</strong>
                                        </div>
                                        <div class="col-md-6">
                                            <small class="text-muted d-block">Due Date</small>
                                            <strong>${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="modal-footer-actions">
                        ${!isPaid 
                            ? `<button class="btn btn-danger" onclick="rejectWork(${exchangeId})">Reject</button>` 
                            : `<button class="btn btn-success" disabled>Done</button>`}
                        </div>
                    </div>
                </div>
            `;

            // Update modal content
            $("#detailsModal .modal-title-container").html(headerHtml);
            $("#detailsModal .modal-body").html(bodyHtml);
            
            // Show modal with enhanced animation
            $("#detailsModal").modal("show");
            
            // Add pulse animation to unpaid/overdue items
            if (!isPaid) {
                $(".status-badge").addClass("pulse");
            }
        }

        // Enhanced chat function
        function openChat(exchangeId) {
            // Show loading state
            const chatBtn = $(".btn-chat");
            const originalText = chatBtn.html();
            chatBtn.html('<i class="fas fa-spinner fa-spin me-2"></i>Opening...');
            chatBtn.prop('disabled', true);
            
            // Simulate loading delay
            setTimeout(() => {
                // Restore button
                chatBtn.html(originalText);
                chatBtn.prop('disabled', false);
                
                // Navigate to chat
                window.location.href = `/pages/messages.html?exchangeId=${exchangeId}`;
            }, 1500);
        }

        // Additional action functions
        function processPayment(exchangeId) {
            alert(`Redirecting to payment processing for Exchange #${exchangeId}`);
        }

        function downloadInvoice(exchangeId) {
            alert(`Downloading invoice for Exchange #${exchangeId}`);
        }

        function viewFullDetails(exchangeId) {
            alert(`Opening detailed view for Exchange #${exchangeId}`);
        }

        // Enhanced modal events
        $(document).ready(function() {
            $('#detailsModal').on('show.bs.modal', function () {
                $(this).find('.fade-in').each(function(index) {
                    $(this).css('animation-delay', (index * 0.1) + 's');
                });
            });
        });
    // Example chat opener
function openChat(exchangeId) {
    // Redirect to messaging page or open chat modal
    window.location.href = `/pages/messages.html?exchangeId=${exchangeId}`;
}

// Payment modal
function openPaymentModal(exchangeId, price) {
    $("#paymentModal .modal-title").text("Payment for Exchange #" + exchangeId);
    $("#paymentAmount").text(`$${price.toFixed(2)}`);
    $("#confirmPayBtn").off("click").on("click", function () {
        // Redirect to PayHere or trigger payment API
        window.location.href = `https://sandbox.payhere.lk/pay?amount=${price}&order_id=${exchangeId}`;
    });
    $("#paymentModal").modal("show");
}
