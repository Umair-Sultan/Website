document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("form").addEventListener("submit", async (event) => {
        event.preventDefault();
  
        const username = document.querySelector("input[name='username']").value.trim();
        const password = document.querySelector("input[name='password']").value.trim();
  
        if (!username || !password) {
            alert("All fields are required!");
            return;
        }
  
        // Check if admin is logging in
        if (username === "admin" && password === "admin") {
            window.location.href = "adminpanel.html";
            return;
        }
  
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "include", // ✅ Include cookies for session tracking
            });
  
            const result = await response.json();
  
            if (response.ok) {
                localStorage.setItem("username", result.username);  // ✅ Store username
                window.location.href = "home.html"; // Redirect
            } else {
                alert(result.message || "Login failed!");
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
        }
    });
  });
  