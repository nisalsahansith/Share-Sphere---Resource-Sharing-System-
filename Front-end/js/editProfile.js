$(document).ready(function () {
            const token = localStorage.getItem("token");

            // Fetch profile details
            $.ajax({
                url: "http://localhost:8080/getprofile/getprofildetails",
                type: "GET",
                data:{userId:localStorage.getItem("userId")},
                headers: { "Authorization": "Bearer " + token },
                success: function (res) {
                    const user = res.data;
                    console.log(user)
                    $("#firstName").val(user.firstName);
                    $("#lastName").val(user.lastName);
                    $("#mobile").val(user.mobile);
                    $("#address").val(user.address);
                    $("#fullName").text(user.firstName + " " + user.lastName);
                    $("#role").text(user.role);
                    if (user.userImage) {
                        $("#profileImagePreview").attr("src", user.userImage);
                    }
                },
                error: function (err) {
                    console.error(err);
                }
            });

            // Preview uploaded image
            $("#profileImage").on("change", function (e) {
                const file = e.target.files[0];
                if (file) {
                    $("#profileImagePreview").attr("src", URL.createObjectURL(file));
                }
            });

            // Show/hide password fields
            $("#changePasswordBtn").click(function () {
                $("#passwordFields").toggle();
            });

            // Submit profile update
            $("#profileForm").on("submit", function (e) {
                e.preventDefault();

                const formData = new FormData();
                formData.append("userId", localStorage.getItem("userId"));
                formData.append("firstName", $("#firstName").val());
                formData.append("lastName", $("#lastName").val());
                formData.append("mobile", $("#mobile").val());
                formData.append("address", $("#address").val());

                const imageFile = $("#profileImage")[0].files[0];
                if (imageFile) formData.append("userImage", imageFile);

                const newPassword = $("#newPassword").val();
                const confirmPassword = $("#confirmPassword").val();
                const currentPassword = $("#currentPassword").val();

                if (newPassword && newPassword !== confirmPassword) {
                    Swal.fire("Error", "Passwords do not match!", "error");
                    return;
                }
                if (newPassword) {
                    formData.append("currentPassword", currentPassword);
                    formData.append("newPassword", newPassword);
                }

                // 🔄 Show buffering modal
                Swal.fire({
                    title: "Updating Profile...",
                    text: "Please wait while we save your changes",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                $.ajax({
                    url: "http://localhost:8080/getprofile/updateprofile",
                    type: "PUT",
                    headers: { "Authorization": "Bearer " + token },
                    processData: false,
                    contentType: false,
                    data: formData,
                    success: function (res) {
                        Swal.close(); // remove loader
                        Swal.fire("Success", "Profile updated successfully!", "success");
                        $("#passwordFields").hide();
                        $("#currentPassword, #newPassword, #confirmPassword").val("");
                    },
                    error: function (err) {
                        Swal.close(); // remove loader
                        Swal.fire("Error", "Failed to update profile!", "error");
                    }
                });
            });

        });
  