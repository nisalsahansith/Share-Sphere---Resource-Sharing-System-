$(document).ready(function () {
    let allTransactions = [];

    // helper: shorten long ids
    function shortenId(id) {
        if (!id) return "-";
        return id.length > 12 ? id.substring(0, 6) + "..." + id.substring(id.length - 5) : id;
    }

    function renderTransactions(data) {
        const $table = $("#transactionsTable");
        $table.empty();

        if (!data || data.length === 0) {
            $table.append(`<tr><td colspan="8" class="text-center">No transactions found</td></tr>`);
            return;
        }

        data.forEach((tx, index) => {
            const payer = `<span class="truncate-id" title="${tx.payerId}">${shortenId(tx.payerId)}</span>`;
            const receiver = `<span class="truncate-id" title="${tx.receiverId}">${shortenId(tx.receiverId)}</span>`;
            const exchange = tx.exchangeId || "-";
            const amount = `$${tx.amount.toFixed(2)}`;
            const date = tx.paymentDate ? tx.paymentDate.replace("T", " ") : "-";

            let statusBadge = "";
            switch (tx.paymentStatus?.toUpperCase()) {
                case "COMPLETED":
                case "FINISHED":
                    statusBadge = `<span class="badge-active">Completed</span>`;
                    break;
                case "PENDING":
                    statusBadge = `<span class="badge-pending">Pending</span>`;
                    break;
                default:
                    statusBadge = `<span class="badge-restricted">${tx.paymentStatus || "UNKNOWN"}</span>`;
            }

            // Actions change based on status
            let actions = `
                <button class="btn-action btn-view" data-id="${tx.paymentId}">
                  <i class="fas fa-eye"></i>
                </button>
            `;

            if (tx.paymentStatus?.toUpperCase() === "COMPLETED" || tx.paymentStatus?.toUpperCase() === "FINISHED") {
                actions += `
                    <button class="btn-action btn-release" data-tx='${JSON.stringify(tx)}'>
                        <i class="fas fa-check-circle"></i>
                    </button>
                    <button class="btn-action btn-refund" data-tx='${JSON.stringify(tx)}'>
                        <i class="fas fa-undo"></i>
                    </button>
                `;
                }


            $table.append(`
              <tr>
                <td>#${index + 1}</td>
                <td>${payer}</td>
                <td>${receiver}</td>
                <td>${exchange}</td>
                <td>${amount}</td>
                <td>${statusBadge}</td>
                <td>${date}</td>
                <td>${actions}</td>
              </tr>
            `);
        });
    }

    function loadTransactions() {
        $.ajax({
            url: "http://localhost:8080/admin/transaction/getall",
            type: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            success: function (response) {
                allTransactions = response.data || [];
                renderTransactions(allTransactions);
            },
            error: function (xhr) {
                console.error("Error fetching transactions:", xhr);
                $("#transactionsTable").html(
                    `<tr><td colspan="8" class="text-center text-danger">Failed to load transactions</td></tr>`
                );
            }
        });
    }

    // 🔍 Search filter
    $("#transactionSearch").on("input", function () {
        const search = $(this).val().toLowerCase();
        const filtered = allTransactions.filter(tx =>
            tx.payerId.toLowerCase().includes(search) ||
            tx.receiverId.toLowerCase().includes(search) ||
            (tx.transactionId && tx.transactionId.toLowerCase().includes(search)) ||
            (tx.exchangeId && tx.exchangeId.toLowerCase().includes(search))
        );
        renderTransactions(filtered);
    });

    // 🚀 Load on page start
    loadTransactions();
});

// Release (Payout)
// Release (Payout)
$(document).on("click", ".btn-release", function () {
    const tx = JSON.parse($(this).attr("data-tx"));
    const token = localStorage.getItem("token");

    const payOutDto = {
        id: null,
        receiverId: tx.receiverId,
        amount: tx.amount,
        commission:  0,
        totalAmount: 0,
        status: "RELEASED",
        exchange: tx.exchangeId
    };

    $.ajax({
        url: "http://localhost:8080/admin/transaction/payout",
        type: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        data: JSON.stringify(payOutDto),
        success: function (res) {
            Swal.fire({
                icon: "success",
                title: "Payout Released",
                text: res.message,
                showConfirmButton: false,
                timer: 2000
            });
        },
        error: function (xhr) {
            Swal.fire({
                icon: "error",
                title: "Payout Failed",
                text: xhr.responseJSON?.message || "Something went wrong",
                confirmButtonText: "OK"
            });
        }
    });
});


// Refund
$(document).on("click", ".btn-refund", function () {
    const tx = JSON.parse($(this).attr("data-tx"));
    const token = localStorage.getItem("token");

    const refundDto = {
        id: null,
        amount: tx.amount,
        receiverId: { id: tx.payerId },
        status: "REFUNDED",
        exchange: { id: tx.exchangeId }
    };

    $.ajax({
        url: "http://localhost:8080/admin/transaction/refund",
        type: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        data: JSON.stringify(refundDto),
        success: function (res) {
            Swal.fire({
                icon: "success",
                title: "Refund Processed",
                text: res.message,
                showConfirmButton: false,
                timer: 2000
            });
        },
        error: function (xhr) {
            Swal.fire({
                icon: "error",
                title: "Refund Failed",
                text: xhr.responseJSON?.message || "Something went wrong",
                confirmButtonText: "OK"
            });
        }
    });
});
