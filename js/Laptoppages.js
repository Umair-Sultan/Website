async function loadLaptops(category) {
    try {
        const response = await fetch("http://localhost:5000/api/laptop"); // Fetch all laptops
        const laptops = await response.json();

        if (!Array.isArray(laptops)) {
            throw new Error("Invalid data format: Expected an array");
        }

        const laptopGrid = document.querySelector(".laptop-grid");
        laptopGrid.innerHTML = ""; // Clear existing content

        // Filter laptops by category
        const filteredLaptops = laptops.filter(laptop => 
            laptop.category && laptop.category.toLowerCase() === category.toLowerCase()
        );

        if (filteredLaptops.length === 0) {
            laptopGrid.innerHTML = `<p>No ${category} laptops found.</p>`;
            return;
        }

        filteredLaptops.forEach(laptop => {
            const laptopCard = document.createElement("div");
            laptopCard.classList.add("laptop-card");

            laptopCard.innerHTML = `
                <a href="/desc.html?id=${laptop.id}">
                    <img src="http://localhost:5000/uploads/${laptop.image || 'default-laptop.jpg'}" 
                        alt="${laptop.name || 'Laptop'}" 
                        onerror="this.onerror=null; this.src='/assets/images/default-laptop.jpg';">
                    <div class="laptop-details">
                        <h3>Model: ${laptop.name || 'Unknown'}</h3>
                        <p>${laptop.description || 'No description available'}</p>
                        <p>Price: Rs${laptop.price || 'N/A'}</p>
                        <button class="view-details-btn">View Details</button>
                    </div>
                </a>
            `;

            laptopGrid.appendChild(laptopCard);
        });

        // Add dynamic styles for the button
        addButtonStyles();

    } catch (error) {
        console.error(`Error fetching ${category} laptops:`, error);
    }
}

// Function to dynamically add button styles

function addButtonStyles() {
    const style = document.createElement("style");
    style.innerHTML = `
        .view-details-btn {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 10px 15px;
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            cursor: pointer;
            border-radius: 8px;
            transition: background-color 0.3s ease, transform 0.2s ease;
            display: block;
            width: 100%;
            text-align: center;
            margin-top: 10px;
        }

        .view-details-btn:hover {
            background-color: #0056b3;
            transform: scale(1.05);
        }

        .view-details-btn:active {
            transform: scale(0.95);
        }
    `;
    document.head.appendChild(style);
}

// Call this function on page load with a default category
document.addEventListener("DOMContentLoaded", function() {
    loadLaptops("category"); // Change this to any category you want by default
});


document.addEventListener("DOMContentLoaded", () => {
    const laptopLinks = document.querySelectorAll(".laptop-item");

    laptopLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const laptopId = event.target.getAttribute("data-id");

            // Redirect to the details page with the laptop ID in the URL
            window.location.href = `laptop-detail.html?id=${laptopId}`;
        });
    });
});
