document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const emailInput = document.querySelector('input[type="email"]').value.trim();
    const passwordInput = document.querySelector('input[type="password"]').value.trim();

    // 🚀 Check if Admin is logging in
    if (emailInput === "admin@gmail.com" && passwordInput === "1234") {
        alert("Admin Login Successful!");
        window.location.href = "selectRole.html"; // Redirect to Admin Dashboard
        return;
    }

    // 🚀 Retrieve stored user data for normal users
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        alert("No user found. Please register first.");
        return;
    }

    const userData = JSON.parse(storedUser);

    // 🚀 Check if user credentials match stored data
    if (emailInput === userData.email && passwordInput === userData.password) {
        alert("User Login Successful!");
        window.location.href = "userDashboard.html"; // Redirect to User Dashboard
    } else {
        alert("Invalid email or password. Please try again.");
    }
});
