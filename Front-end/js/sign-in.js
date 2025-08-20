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
            
            if (response.code === 200) {
                alert("Login successful! " + response.data);
                redirectToDashboard(response.data.role);
            } else {
                alert("Unexpected response: " + response.data);
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
            
            alert(errorMessage);
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