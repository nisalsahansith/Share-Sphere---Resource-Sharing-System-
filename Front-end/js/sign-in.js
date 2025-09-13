$('.sign-in-form').on('submit', function (event) {
    event.preventDefault();
    
    const email = $('#email').val().trim();
    const password = $('#password').val().trim();
    
    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    const submitButton = $(this).find('button[type="submit"]');
    submitButton.prop('disabled', true).text('Signing in...');
    
    $.ajax({
        url: "http://localhost:8080/auth/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            email: email,
            password: password
        }),
        success: function (response) {
           if (response.data.status === "BLOCK") {
                Swal.fire({
                    icon: 'error',
                    title: 'User Blocked',
                    text: 'This user has been blocked and cannot perform any actions.',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK'
                });
               return
            }

            
            if (response.code === 200) {
                Swal.fire({
                icon: 'success',
                title: 'Login Successful!',
                text: 'Welcome back, ' + response.data.role + '!',
                showConfirmButton: false,
                timer: 2000
            });

                localStorage.setItem("userId", response.data.id);
                localStorage.setItem("token", response.data.accessToken);
                redirectToDashboard(response.data.role);
            } else {
                Swal.fire({
                icon: 'warning',
                title: 'Unexpected Response',
                text: response.data,
                confirmButtonText: 'OK'
            });
            }
        },
        error: function (xhr, status, error) {
            console.log("Login Error:", {
                status: xhr.status,
                statusText: xhr.statusText,
                responseJSON: xhr.responseJSON,
                error: error
            });
            
            let errorMessage = "Login failed. ";
            
            switch (xhr.status) {
                case 401: // Unauthorized - Invalid credentials
                    errorMessage += "Invalid email or password.";
                    break;
                case 404: // Not Found - Endpoint not found
                    errorMessage += "Server not found. Please try again later.";
                    break;
                default:
                    errorMessage += "An unexpected error occurred.";
            }
            
            Swal.fire({
                icon: 'error', // <-- use string 'error'
                title: 'Login Failed', // <-- fixed title
                text: errorMessage,
                confirmButtonText: 'Try Again'
            });
        },
        complete: function () {
            submitButton.prop('disabled', false).text('Sign In');
        }
    });
});

function redirectToDashboard(role) {
    if (role === "USER") {
        window.location.href = '/pages/user-dashboard.html';
    }else if (role === "ADMIN") {
        window.location.href = '/pages/admin-dashboard.html';
    } else {
        Swal.fire({
            title: 'Access Denied!',
            text: 'No valid user role found. Please contact administrator.',
            icon: 'error',
            confirmButtonText: 'Try Again',
            confirmButtonColor: '#e74c3c',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            backdrop: `
                rgba(0,0,0,0.8)
                url("/images/nyan-cat.gif")
                left top
                no-repeat
            `,
            customClass: {
                popup: 'animated bounceIn',
                title: 'swal-title-white',
                content: 'swal-content-white'
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }    
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/login.html';
            }
        })
    }
}

$(document).ready(function () {
    let userEmail = "";

    // Open Forgot Password modal
    $("a:contains('Forgot password?')").click(function (e) {
        e.preventDefault();
        $("#forgotPasswordModal").modal("show");
    });

    // Step 1: Submit Email
    $("#forgotPasswordForm").submit(function (e) {
        e.preventDefault();
        userEmail = $("#resetEmail").val();

        $.ajax({
            url: "http://localhost:8080/userbasic/forgot-password", // your backend endpoint
            type: "GET",
            contentType: "application/json",
            data: { email: userEmail },
            success: function (res) {
                Swal.fire("OTP Sent!", "Check your email for the OTP code.", "success");
                $("#forgotPasswordModal").modal("hide");
                $("#otpModal").modal("show");
            },
            error: function () {
                Swal.fire("Error", "Could not send OTP. Try again.", "error");
            }
        });
    });

    // Step 2: Verify OTP + Reset Password
    $("#verifyOtpForm").submit(function (e) {
        e.preventDefault();
        const otp = $("#otpCode").val();
        const newPassword = $("#newPassword").val();

        $.ajax({
            url: "http://localhost:8080/userbasic/reset-password-with-otp", // your backend endpoint
            type: "POST",
            data: { email: userEmail, otp: otp, newPassword: newPassword },
            success: function (res) {
                Swal.fire("Success", "Your password has been reset!", "success");
                $("#otpModal").modal("hide");
            },
            error: function () {
                Swal.fire("Error", "Invalid OTP or expired. Try again.", "error");
            }
        });
    });
});
