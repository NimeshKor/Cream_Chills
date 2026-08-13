let cart = [];

// Show one section and hide the others
function showSection(sectionId) {
    const sections = ["menu", "cart", "checkout", "track", "admin"];

    sections.forEach(function(section) {
        document.getElementById(section).classList.add("hidden");
    });

    document.getElementById(sectionId).classList.remove("hidden");

    if (sectionId === "cart") {
        displayCart();
    }
}


// Get products from the backend
async function loadProducts() {
    try {
        const response = await fetch("/api/products");
        const products = await response.json();

        const productContainer = document.getElementById("products");

        productContainer.innerHTML = "";

        products.forEach(function(product) {
            productContainer.innerHTML += `
                <div class="product">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>Category: ${product.category}</p>
                    <h4>₹${product.price}</h4>

                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                        Add to Cart
                    </button>
                </div>
            `;
        });

    } catch (error) {
        console.log("Error loading products:", error);

        document.getElementById("products").innerHTML =
            "<p>Could not load products.</p>";
    }
}


// Add product to cart
function addToCart(id, name, price) {
    const existingItem = cart.find(function(item) {
        return item.id === id;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }

    alert("Item added to cart!");
}


// Display cart
function displayCart() {
    const cartContainer = document.getElementById("cartItems");
    const totalElement = document.getElementById("cartTotal");

    cartContainer.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        totalElement.innerText = "0";
        return;
    }

    cart.forEach(function(item) {
        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        cartContainer.innerHTML += `
            <div class="cart-item">
                <strong>${item.name}</strong>

                <p>₹${item.price} × ${item.quantity}</p>

                <button onclick="changeQuantity(${item.id}, 1)">+</button>

                <button onclick="changeQuantity(${item.id}, -1)">-</button>

                <button onclick="removeFromCart(${item.id})">
                    Remove
                </button>
            </div>
        `;
    });

    totalElement.innerText = total;
}


// Change quantity
function changeQuantity(id, amount) {
    const item = cart.find(function(item) {
        return item.id === id;
    });

    if (!item) {
        return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {
        removeFromCart(id);
        return;
    }

    displayCart();
}


// Remove product from cart
function removeFromCart(id) {
    cart = cart.filter(function(item) {
        return item.id !== id;
    });

    displayCart();
}


// Place order
document.getElementById("checkoutForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const customerName =
        document.getElementById("customerName").value;

    const mobile =
        document.getElementById("mobile").value;

    const address =
        document.getElementById("address").value;

    const payment =
        document.getElementById("payment").value;


    const total = cart.reduce(function(sum, item) {
        return sum + (item.price * item.quantity);
    }, 0);


    const orderData = {
        customerName: customerName,
        mobile: mobile,
        address: address,
        payment: payment,
        total: total,

        items: cart.map(function(item) {
            return {
                productId: item.id,
                quantity: item.quantity
            };
        })
    };


    try {
        const response = await fetch("/api/orders", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(orderData)
        });


        const result = await response.json();


        if (response.ok) {
            document.getElementById("orderMessage").innerText =
                "Order placed successfully! Your Order ID is: " +
                result.orderId;

            cart = [];

            document.getElementById("checkoutForm").reset();

        } else {
            document.getElementById("orderMessage").innerText =
                "Could not place order.";
        }

    } catch (error) {
        console.log("Order error:", error);

        document.getElementById("orderMessage").innerText =
            "Server error. Please try again.";
    }
});


// Track order
async function trackOrder() {
    const orderId =
        document.getElementById("orderId").value.trim();

    if (orderId === "") {
        alert("Please enter an Order ID.");
        return;
    }


    try {
        const response =
            await fetch("/api/orders/" + orderId);

        const result = await response.json();

        const statusContainer =
            document.getElementById("orderStatus");


        if (response.ok) {
            statusContainer.innerHTML = `
                <h3>Order: ${result.order_id}</h3>

                <p>Customer: ${result.customer_name}</p>

                <p>Total: ₹${result.total}</p>

                <h3>Status: ${result.status}</h3>
            `;
        } else {
            statusContainer.innerHTML =
                "<p>Order not found.</p>";
        }

    } catch (error) {
        console.log("Tracking error:", error);

        document.getElementById("orderStatus").innerHTML =
            "<p>Server error.</p>";
    }
}


// Admin login
async function adminLogin() {
    const username =
        document.getElementById("adminUsername").value;

    const password =
        document.getElementById("adminPassword").value;


    try {
        const response = await fetch("/api/admin/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: username,
                password: password
            })
        });


        const result = await response.json();


        if (response.ok) {
            document.getElementById("adminLogin")
                .classList.add("hidden");

            document.getElementById("adminOrders")
                .classList.remove("hidden");

            loadOrders();

        } else {
            document.getElementById("loginMessage").innerText =
                "Invalid username or password.";
        }

    } catch (error) {
        console.log("Login error:", error);

        document.getElementById("loginMessage").innerText =
            "Server error.";
    }
}


// Load all orders for admin
async function loadOrders() {
    try {
        const response =
            await fetch("/api/orders");

        const orders = await response.json();

        const ordersContainer =
            document.getElementById("ordersList");

        ordersContainer.innerHTML = "";


        orders.forEach(function(order) {
            ordersContainer.innerHTML += `
                <div class="order">

                    <h3>${order.order_id}</h3>

                    <p>
                        Customer: ${order.customer_name}
                    </p>

                    <p>
                        Mobile: ${order.mobile}
                    </p>

                    <p>
                        Total: ₹${order.total}
                    </p>

                    <p>
                        Status: ${order.status}
                    </p>

                    <select
                        onchange="updateStatus('${order.order_id}', this.value)"
                    >

                        <option value="Order Placed"
                            ${order.status === "Order Placed" ? "selected" : ""}>
                            Order Placed
                        </option>

                        <option value="Confirmed"
                            ${order.status === "Confirmed" ? "selected" : ""}>
                            Confirmed
                        </option>

                        <option value="Preparing"
                            ${order.status === "Preparing" ? "selected" : ""}>
                            Preparing
                        </option>

                        <option value="Out for Delivery"
                            ${order.status === "Out for Delivery" ? "selected" : ""}>
                            Out for Delivery
                        </option>

                        <option value="Delivered"
                            ${order.status === "Delivered" ? "selected" : ""}>
                            Delivered
                        </option>

                    </select>

                </div>
            `;
        });

    } catch (error) {
        console.log("Orders error:", error);
    }
}


// Update order status
async function updateStatus(orderId, status) {
    try {
        const response = await fetch(
            "/api/orders/" + orderId + "/status",
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );


        if (response.ok) {
            alert("Order status updated!");
            loadOrders();
        } else {
            alert("Could not update status.");
        }

    } catch (error) {
        console.log("Status update error:", error);
        alert("Server error.");
    }
}


// Start the website
loadProducts();