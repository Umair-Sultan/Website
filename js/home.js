document.addEventListener("DOMContentLoaded", () => {
    const hpCovers = document.querySelectorAll(".hpcover");
    const dellCover = document.querySelector(".dellcover");
    const lenovoCover = document.querySelector(".lenovocover");
    const chromebook = document.querySelector(".chromebook"); // Select Chromebook cover
    const accesories = document.querySelector(".accesories"); // Select Accessories

    // Function to check if an element is in the viewport
    const isElementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top <= windowHeight && rect.bottom >= 0;
    };

    // Function to handle scroll events and toggle visibility
    const handleScroll = () => {
        // Check visibility for HP covers
        hpCovers.forEach((hpCover) => {
            if (isElementInViewport(hpCover)) {
                hpCover.classList.add("visible");
            } else {
                hpCover.classList.remove("visible");
            }
        });

        // Check visibility for the Dell cover
        if (dellCover) {
            if (isElementInViewport(dellCover)) {
                dellCover.classList.add("visible");
            } else {
                dellCover.classList.remove("visible");
            }
        }

        // Check visibility for the Lenovo cover
        if (lenovoCover) {
            if (isElementInViewport(lenovoCover)) {
                lenovoCover.classList.add("visible");
            } else {
                lenovoCover.classList.remove("visible");
            }
        }

        // Check visibility for the Chromebook cover
        if (chromebook) {
            if (isElementInViewport(chromebook)) {
                chromebook.classList.add("visible");
            } else {
                chromebook.classList.remove("visible");
            }
        }

        // Check visibility for the Accessories section
        if (accesories) {
            if (isElementInViewport(accesories)) {
                accesories.classList.add("visible");
            } else {
                accesories.classList.remove("visible");
            }
        }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Trigger visibility check on page load
    handleScroll();
});

// Trigger sliding effect for the Accessories on page load
window.addEventListener('load', () => {
    document.querySelector('.accesories').classList.add('visible');
});

// JavaScript to handle brand logos slider
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".brandlogos .logos-container");
    const leftArrow = document.querySelector(".arrow-left");
    const rightArrow = document.querySelector(".arrow-right");

    let scrollAmount = 0;
    const scrollStep = 200; // Adjust this to control how much to scroll

    rightArrow.addEventListener("click", () => {
        container.scrollBy({
            left: scrollStep,
            behavior: "smooth"
        });
    });

    leftArrow.addEventListener("click", () => {
        container.scrollBy({
            left: -scrollStep,
            behavior: "smooth"
        });
    });
});

// To show the Login Container

document.addEventListener("DOMContentLoaded", ()=>{

    const loginbutton=document.getElementById("Login-btn");

    const logincontainer=document.getElementById("Login-container");

    loginbutton.addEventListener("click" , function(){

        logincontainer.classList.toggle("show");

    });

    document.addEventListener("click", function (event) {
        if (!loginbutton.contains(event.target) && !logincontainer.contains(event.target)) {
            logincontainer.classList.remove("show");
        }
    });

});

// User Name when login

document.addEventListener("DOMContentLoaded", async () => {
    const userNameElement = document.getElementById("user-name");

    try {
        const response = await fetch("http://localhost:5000/api/user", {
            credentials: "include", // ✅ Send session cookies
        });

        const result = await response.json();

        if (result.loggedIn) {
            userNameElement.textContent = `Welcome, ${result.username}`;
        } else {
            userNameElement.textContent = "Guest";
        }
    } catch (error) {
        userNameElement.textContent = "Guest";
    }
});

// username when signin

document.addEventListener("DOMContentLoaded", async () => {
    const userNameElement = document.getElementById("user-name");

    if (!userNameElement) return; // Ensure element exists

    try {
        const response = await fetch("http://localhost:5000/api/users", {
            credentials: "include", // ✅ Send session cookies
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const result = await response.json();

        userNameElement.textContent = result.signIn ? `Welcome, ${result.username}` : "Guest";
    } catch (error) {
        console.error("Error fetching user data:", error);
        userNameElement.textContent = "Guest";
    }
});

// logout

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", async () => {
        try {
            await fetch("http://localhost:5000/api/logout", {
                method: "POST",
                credentials: "include", // ✅ Send session cookies
            });

            localStorage.removeItem("username"); // ✅ Remove stored username
            window.location.href = "home.html"; // Redirect to login page
        } catch (error) {
            alert("Logout failed. Try again.");
        }
    });

});

// List of predefined suggestions

const suggestionsList = ["Laptops", "HP Laptops", "Dell Laptops", "MSI Laptops", "Lenovo Laptops" , "Gaming", "Headphones", "Mouse", "Keyboard", "Monitor", "Tablet", "Smartphone"];

// Search Suggestions

function showsuggestion() {
    let input = document.getElementById("search").value.toLowerCase().trim();
    let searchContainer = document.getElementById("search-cont");
    let suggestionBox = document.getElementById("suggestion");

    suggestionBox.innerHTML = ""; // Clear previous suggestions

    if (input !== "") {
        let filteredSuggestions = suggestionsList.filter(item => item.toLowerCase().includes(input));

        if (filteredSuggestions.length > 0) {
            searchContainer.style.display = "block"; // Show container

            filteredSuggestions.forEach(item => {
                let li = document.createElement("li");
                let a = document.createElement("a");
                a.href = "#"; 
                a.textContent = item;

                li.appendChild(a);
                li.onclick = function () {
                    document.getElementById("search").value = item; // Set input value
                    searchContainer.style.display = "none"; // Hide container after selection
                };

                suggestionBox.appendChild(li);
            });

            let newHeight = Math.min(filteredSuggestions.length * 40, 200); // Max height 200px
            searchContainer.style.height = newHeight + "px";

        } else {
            searchContainer.style.display = "none"; // Hide if no matches
        }
    } else {
        searchContainer.style.display = "none"; // Hide when input is empty
    }
}

// Hide Search container when clicking outside

document.addEventListener("click", function (e) {
    let searchContainer = document.getElementById("search-cont");
    let searchInput = document.getElementById("search");

    if (!searchContainer.contains(e.target) && e.target !== searchInput) {
        searchContainer.style.display = "none";
    }
});

// redirect to chart page

document.getElementById("chart-button").addEventListener("click", function() {
    window.location.href = "chart.html"; // Replace with your actual chart page URL
});


// script for banner sliding and laptop catelog sliding 


document.addEventListener("DOMContentLoaded", function () {
    // Show loader until all images are loaded
    const loader = document.createElement("div");
    loader.innerText = "Loading...";
    loader.style.position = "fixed";
    loader.style.top = "50%";
    loader.style.left = "50%";
    loader.style.transform = "translate(-50%, -50%)";
    loader.style.fontSize = "20px";
    loader.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    loader.style.color = "white";
    loader.style.padding = "10px 20px";
    loader.style.borderRadius = "5px";
    document.body.appendChild(loader);

    let imagesLoaded = 0;
    const images = document.querySelectorAll("img");
    const totalImages = images.length;

    images.forEach(img => {
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                loader.style.display = "none";
            }
        };
    });

    // Banner Slider
    const banners = [
        "/assets/images/Catelog/BANNER/b1.jpg",
        "/assets/images/Catelog/BANNER/b2.jpg",
        "/assets/images/Catelog/BANNER/b3.jpg"
    ];
    let bannerIndex = 0;
    const bannerElement = document.querySelector(".banner1 img");
    bannerElement.src = banners[bannerIndex]; // Set initial image immediately

    function changeBanner() {
        bannerIndex = (bannerIndex + 1) % banners.length;
        bannerElement.src = banners[bannerIndex];
    }
    setInterval(changeBanner, 3000);

    // Laptop Covers Slider
    const laptopCovers = {
        hp: ["/assets/images/Catelog/HP/hp.jpg", "/assets/images/Catelog/HP/hp 3.jpg", "/assets/images/Catelog/HP/hp 4.jpg"],
        dell: ["/assets/images/Catelog/DELL/dell 2.jpg", "/assets/images/Catelog/DELL/dell 3.jpeg", "/assets/images/Catelog/DELL/dell.jpg"],
        lenovo: ["/assets/images/Catelog/HP/hp 3.jpg", "/assets/images/Catelog/HP/hp 3.jpg", "/assets/images/Catelog/HP/hp1.jpg"],
        chromebook: ["/assets/images/Catelog/MACBOOK/mac 2.jpg", "/assets/images/Catelog/MACBOOK/mac 1.jpg", "/assets/images/Catelog/MACBOOK/mac 5.jpg"],
        accessories: ["/assets/images/Catelog/ACCESSORIES/ass1.jpg", "/assets/images/Catelog/ACCESSORIES/ass2.jpg", "/assets/images/Catelog/ACCESSORIES/ass3.jpg"],
        macbook: ["/assets/images/Catelog/MACBOOK/mac 3.jpg", "/assets/images/Catelog/MACBOOK/mac 4.jpg"]
    };

    function startImageSlider(coverClass, images) {
        let index = 0;
        const coverImage = document.querySelector(`.${coverClass} img`);
        coverImage.src = images[index]; // Set initial image immediately

        function changeImage() {
            index = (index + 1) % images.length;
            coverImage.src = images[index];
        }
        setInterval(changeImage, 3000);
    }

    startImageSlider("hpcover", laptopCovers.hp);
    startImageSlider("dellcover", laptopCovers.dell);
    startImageSlider("lenovocover", laptopCovers.lenovo);
    startImageSlider("chromebook", laptopCovers.chromebook);
    startImageSlider("accesories", laptopCovers.accessories);
    startImageSlider("macbook", laptopCovers.macbook);
});