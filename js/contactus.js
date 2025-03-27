document.getElementById("contactForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const statusMessage = document.getElementById("statusMessage");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
        statusMessage.innerText = "All fields are required!";
        statusMessage.style.color = "red";
        return;
    }

    try {
        const response = await fetch("/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, message }),
        });

        const result = await response.json();
        statusMessage.innerText = result.message;
        statusMessage.style.color = "green";

        // ✅ Clear form fields after successful submission
        nameInput.value = "";
        emailInput.value = "";
        messageInput.value = "";
    } catch (error) {
        statusMessage.innerText = "Error sending message!";
        statusMessage.style.color = "red";
        console.error("Error:", error);
    }
});
