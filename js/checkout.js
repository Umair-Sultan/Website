document.addEventListener("DOMContentLoaded", function () {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    let orderList = document.getElementById("order-items");
    let totalPrice = document.getElementById("total-price");

    let total = 0;
    orderList.innerHTML = "";
    cartItems.forEach(item => {
        let li = document.createElement("li");
        li.textContent = `${item.name} - $${item.price}`;
        orderList.appendChild(li);
        total += parseFloat(item.price);
    });

    totalPrice.textContent = total.toFixed(2);

    document.getElementById("checkout-form").addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        window.location.href = "home.html";
    });
});
