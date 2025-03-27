document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const laptopId = urlParams.get('id'); // Get laptop ID from the URL

    if (!laptopId) {
        console.error('Laptop ID not found in URL');
        return;
    }

    // Fetch laptop details
    fetch(`/laptop/${laptopId}`)
        .then(response => response.json())
        .then(laptop => {
            // Populate laptop details
            document.getElementById('laptop-name').textContent = laptop.name;
            document.getElementById('laptop-img').src = `/uploads/${laptop.image}`;
            document.getElementById('laptop-price').textContent = `$${laptop.price}`;
            document.getElementById('laptop-description').textContent = laptop.description;
            document.getElementById('laptop-model').textContent = laptop.model;
            document.getElementById('laptop-generation').textContent = laptop.generation;
            document.getElementById('laptop-processor').textContent = laptop.processor;
            document.getElementById('laptop-ram').textContent = laptop.ram;
            document.getElementById('laptop-storage').textContent = laptop.storage;
            document.getElementById('laptop-display').textContent = laptop.display;
            document.getElementById('laptop-keyboard-light').textContent = laptop.keyboard_light ? 'Yes' : 'No';
            document.getElementById('laptop-numeric-keyboard').textContent = laptop.numeric_keyboard ? 'Yes' : 'No';
            document.getElementById('laptop-color').textContent = laptop.color;
            document.getElementById('laptop-weight').textContent = laptop.weight;
            document.getElementById('laptop-os').textContent = laptop.operating_system;
            document.getElementById('laptop-warranty').textContent = laptop.warranty;

            // Fetch related laptops
            fetch(`/related-laptops/${laptop.category}`)
                .then(response => response.json())
                .then(relatedLaptops => {
                    const relatedLaptopsContainer = document.getElementById('related-laptops');
                    relatedLaptopsContainer.innerHTML = ''; // Clear previous content

                    relatedLaptops.forEach(relatedLaptop => {
                        const laptopCard = document.createElement('div');
                        laptopCard.className = 'laptop-card';

                        // Add click event listener to the card
                        laptopCard.addEventListener('click', () => {
                            // Redirect to the details page for the clicked laptopwindow.location.href = `/pages/desc.html?id=${relatedLaptop.id}`;
                            window.location.href = `/desc.html?id=${relatedLaptop.id}`;
                        });

                        // Populate the card content
                        laptopCard.innerHTML = `
                            <img src="/uploads/${relatedLaptop.image}" alt="${relatedLaptop.name}">
                            <h3>${relatedLaptop.name}</h3>
                            <p>Price: $${relatedLaptop.price}</p>
                        `;

                        // Append the card to the container
                        relatedLaptopsContainer.appendChild(laptopCard);
                    });
                })
                .catch(error => console.error('Error fetching related laptops:', error));
        })
        .catch(error => console.error('Error fetching laptop details:', error));
});