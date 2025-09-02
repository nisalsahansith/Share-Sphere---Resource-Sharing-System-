$('.signUp-form').on('submit', function(event) {
    event.preventDefault();
    
    const fullName = $('#username').val().trim();
    const email = $('#email').val().trim();
    const password = $('#password').val().trim();
    
    // Validation with simple SweetAlert
    if (!fullName || !email || !password) {
        Swal.fire('Missing Information', 'Please fill in all fields.', 'warning');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Swal.fire('Invalid Email', 'Please enter a valid email address.', 'error');
        return;
    }
    
    if (password.length < 6) {
        Swal.fire('Weak Password', 'Password must be at least 6 characters long.', 'warning');
        return;
    }
    
    const submitButton = $(this).find('button[type="submit"]');
    submitButton.prop('disabled', true).text('Registering...');
    
    $.ajax({
        url: "http://localhost:8080/auth/register",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            username: fullName,
            email: email,
            password: password,
            role: "USER"
        }),
        success: function(response) {
            console.log("Registration Success:", response);
            
            if (response.code === 200) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Registration successful! ' + response.data,
                    icon: 'success'
                }).then(() => {
                    $('.signUp-form')[0].reset();
                    window.location.href = '/pages/sign-in.html';
                });
            } else {
                Swal.fire('Unexpected Response', response.data, 'question');
            }
        },
        error: function(xhr, status, error) {
            console.log("Registration Error:", {
                status: xhr.status,
                statusText: xhr.statusText,
                responseJSON: xhr.responseJSON,
                error: error
            });
            
            let errorMessage = "Registration failed. ";
            
            switch(xhr.status) {
                case 409: // Conflict - User already exists
                    if (xhr.responseJSON && xhr.responseJSON.data) {
                        errorMessage = xhr.responseJSON.data;
                    } else {
                        errorMessage = "User already exists with this email or username.";
                    }
                    Swal.fire('User Already Exists', errorMessage, 'warning');
                    break;
                    
                case 400: // Bad Request
                    if (xhr.responseJSON && xhr.responseJSON.data) {
                        errorMessage = "Invalid input: " + xhr.responseJSON.data;
                    } else {
                        errorMessage = "Invalid registration data. Please check your inputs.";
                    }
                    Swal.fire('Invalid Information', errorMessage, 'error');
                    break;
                    
                case 500: // Internal Server Error
                    if (xhr.responseJSON && xhr.responseJSON.data) {
                        errorMessage = "Server error: " + xhr.responseJSON.data;
                    } else {
                        errorMessage = "Server error occurred. Please try again later.";
                    }
                    Swal.fire('Server Error', errorMessage, 'error');
                    break;
                    
                case 0: // Network error or CORS
                    errorMessage = "Network error. Please check your internet connection or try again later.";
                    Swal.fire('Connection Error', errorMessage, 'error');
                    break;
                    
                default:
                    if (xhr.responseJSON && xhr.responseJSON.data) {
                        errorMessage = xhr.responseJSON.data;
                    } else if (xhr.responseJSON && xhr.responseJSON.message) {
                        errorMessage = xhr.responseJSON.message;
                    } else {
                        errorMessage = `Unexpected error (${xhr.status}): ${error}`;
                    }
                    Swal.fire('Registration Failed', errorMessage, 'error');
            }
        },
        complete: function() {
            submitButton.prop('disabled', false).text('Sign Up');
        }
    });
});