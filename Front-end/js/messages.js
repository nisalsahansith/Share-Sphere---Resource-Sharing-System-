// Switch between chats
        $(".chat-item").click(function () {
            $(".chat-item").removeClass("active");
            $(this).addClass("active");
            const name = $(this).text().trim();
            $("#chatHeader").text(name);
            $("#chatBody").html(`<div class="message incoming"><p>Hi, this is ${name}!</p></div>`);
        });

        // Send message
        $("#messageForm").submit(function (e) {
            e.preventDefault();
            const msg = $("#messageInput").val().trim();
            if (msg) {
                $("#chatBody").append(`<div class="message outgoing"><p>${msg}</p></div>`);
                $("#messageInput").val("");
                $("#chatBody").scrollTop($("#chatBody")[0].scrollHeight);
            }
        });

        // Send text message
            $("#messageForm").submit(function (e) {
                e.preventDefault();
                const msg = $("#messageInput").val().trim();
                if (msg) {
                    $("#chatBody").append(`<div class="message outgoing"><p>${msg}</p></div>`);
                    $("#messageInput").val("");
                    $("#chatBody").scrollTop($("#chatBody")[0].scrollHeight);
                }
            });

            // Handle image upload
            $("#imageInput").on("change", function () {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        $("#chatBody").append(`
        <div class="message outgoing">
          <img src="${e.target.result}" class="chat-image"/>
        </div>
      `);
                        $("#chatBody").scrollTop($("#chatBody")[0].scrollHeight);
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Handle location sharing
            $("#shareLocation").click(function () {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (pos) {
                        const lat = pos.coords.latitude;
                        const lng = pos.coords.longitude;
                        const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
                        $("#chatBody").append(`
        <div class="message outgoing">
          <a href="${mapsLink}" target="_blank" class="chat-location">
            <i class="fas fa-map-marker-alt"></i> My Location
          </a>
        </div>
      `);
                        $("#chatBody").scrollTop($("#chatBody")[0].scrollHeight);
                    });
                } else {
                    alert("Geolocation not supported in this browser.");
                }
            });
