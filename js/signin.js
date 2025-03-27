document.addEventListener("DOMContentLoaded", () => {
    const signinForm = document.querySelector("form");

    signinForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the form from submitting normally

        // Get the input values
        const username = document.querySelector("input[name='username']").value.trim();
        const password = document.querySelector("input[name='password']").value.trim();
        const retypepassword = document.querySelector("input[name='retypepassword']").value.trim();

        // Validate the inputs
        if (!username || !password || !retypepassword) {
            alert("All fields are required!");
            return;
        }

        if (!username.replace(/\s/g, '')) {
            alert("Username cannot be empty or spaces only!");
            return;
        }

        if (password !== retypepassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            // Send sign-up request to the server
            const response = await fetch("/api/signup", { // Ensure correct endpoint
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }), // Removed retypepassword
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem("username", result.username);
                // Redirect to the home page on successful sign-up
                window.location.href = "/login.html";
            } else {
                // Show error message
                alert(result.message || "Error occurred during sign-up!");
            }
        } catch (error) {
            console.error("Error during sign-up:", error);
            alert("An error occurred. Please try again later.");
        }
    });
});
