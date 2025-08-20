$("#openSidebar").on("click", function () {
    $("#sidebar").addClass("active");
});
$("#closeSidebar").on("click", function () {
    $("#sidebar").removeClass("active");
});

$(document).ready(function () {
    const modalEl = document.getElementById("listingModal");
    const modal = new bootstrap.Modal(modalEl);

    $(".view-btn").click(function () {
      const title = $(this).data("title");
      const image = $(this).data("image");
      const description = $(this).data("description");
      const condition = $(this).data("condition");
      const priceHour = $(this).data("pricehour");
      const priceDay = $(this).data("priceday");

      $("#modalTitle").text(title);
      $("#modalImage").attr("src", image).attr("alt", title);
      $("#modalDescription").text(description);
      $("#modalCondition").text(condition);
      $("#modalPriceHour").text(priceHour);
      $("#modalPriceDay").text(priceDay);

      modal.show();
    });

    document.getElementById('modalCloseBtn').addEventListener('click', () => {
        modal.hide();
    });
});

  
// $("#view-btn").click(function() {
//     const modalEl = document.getElementById('listingModal');
//     const modal = new bootstrap.Modal(modalEl);
//     modal.show();
//   });
