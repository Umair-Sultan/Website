document.addEventListener("DOMContentLoaded", function () {
    const services = document.querySelectorAll(".service");
    let activeDetail = null;

    services.forEach(service => {
        service.addEventListener("click", function () {
            const serviceType = this.getAttribute("data-type");

            // If the same service is clicked, hide it and remove activeDetail
            if (activeDetail && activeDetail.dataset.type === serviceType) {
                activeDetail.classList.remove("show");
                setTimeout(() => {
                    activeDetail.remove(); // Remove it after transition
                    activeDetail = null;
                }, 300);
                return;
            }

            // Remove the previous details div if it exists
            if (activeDetail) {
                activeDetail.classList.remove("show");
                setTimeout(() => {
                    activeDetail.remove();
                }, 300);
            }

            // Create a details div if it doesn’t exist
            const detailsDiv = document.createElement("div");
            detailsDiv.classList.add("service-detail");
            detailsDiv.dataset.type = serviceType;
            detailsDiv.innerHTML = `
                <p>${getServiceDetails(serviceType)}</p>
                <button class="close-btn">Close</button>
            `;
            this.insertAdjacentElement("afterend", detailsDiv);

            // Close button event
            detailsDiv.querySelector(".close-btn").addEventListener("click", function () {
                detailsDiv.classList.remove("show");
                setTimeout(() => {
                    detailsDiv.remove(); // Ensure no extra space remains
                    activeDetail = null;
                }, 300);
            });

            // Delay to trigger smooth transition
            setTimeout(() => {
                detailsDiv.classList.add("show");
            }, 10);

            activeDetail = detailsDiv;
        });
    });

    // Function to return service details
    function getServiceDetails(type) {
        switch (type) {
            case "repair":
                return "We offer expert repair services for all laptop brands.";
            case "custom":
                return "Get a laptop customized to your exact needs.";
            case "warranty":
                return "We provide extended warranty support and assistance.";
            case "consultation":
                return "Our experts help you choose the best laptop.";
            default:
                return "Service details are not available at the moment.";
        }
    }
});
