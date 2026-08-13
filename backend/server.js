require("dotenv").config();


const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Allow JSON data
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Connect to PostgreSQL
const db = new Pool(
    process.env.INSTANCE_UNIX_SOCKET
        ? {
            user: process.env.DB_USER,
            host: process.env.INSTANCE_UNIX_SOCKET,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD
        }
        : {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
        }
);


// Test database connection
db.connect()
    .then(function(client) {
        console.log("Connected to PostgreSQL database.");
        client.release();
    })
    .catch(function(error) {
        console.log("Database connection failed!");
        console.log(error.message);
    });


// Get all available products
app.get("/api/products", async function(req, res) {

    try {

        const result = await db.query(
            "SELECT * FROM products WHERE available = true"
        );

        res.json(result.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Could not get products"
        });
    }
});


// Create a new order
app.post("/api/orders", async function(req, res) {

    try {

        const {
            customerName,
            mobile,
            address,
            payment,
            total,
            items
        } = req.body;

        // Create Order ID
        const orderId = "CC" + Date.now();

        // Save main order
        const orderResult = await db.query(
            `
            INSERT INTO orders
            (order_id, customer_name, mobile, address, payment, total, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
            `,
            [
                orderId,
                customerName,
                mobile,
                address,
                payment,
                total,
                "Order Placed"
            ]
        );

        const orderDatabaseId = orderResult.rows[0].id;

        // Save order items
        for (const item of items) {

            await db.query(
                `
                INSERT INTO order_items
                (order_id, product_id, quantity)
                VALUES ($1, $2, $3)
                `,
                [
                    orderDatabaseId,
                    item.productId,
                    item.quantity
                ]
            );
        }

        res.json({
            message: "Order placed successfully",
            orderId: orderId
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Could not create order"
        });
    }
});


// Get one order for tracking
app.get("/api/orders/:orderId", async function(req, res) {

    try {

        const orderId = req.params.orderId;

        const result = await db.query(
            `
            SELECT *
            FROM orders
            WHERE order_id = $1
            `,
            [orderId]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Database error"
        });
    }
});


// Get all orders for admin
app.get("/api/orders", async function(req, res) {

    try {

        const result = await db.query(
            `
            SELECT *
            FROM orders
            ORDER BY id DESC
            `
        );

        res.json(result.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Could not get orders"
        });
    }
});


// Update order status
app.put("/api/orders/:orderId/status", async function(req, res) {

    try {

        const orderId = req.params.orderId;
        const status = req.body.status;

        await db.query(
            `
            UPDATE orders
            SET status = $1
            WHERE order_id = $2
            `,
            [status, orderId]
        );

        res.json({
            message: "Status updated successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Could not update status"
        });
    }
});


// Simple admin login
app.post("/api/admin/login", function(req, res) {

    const username = req.body.username;
    const password = req.body.password;

    // Simple login for college demonstration
    if (username === "admin" && password === "1234") {

        res.json({
            message: "Login successful"
        });

    } else {

        res.status(401).json({
            message: "Invalid username or password"
        });
    }
});


// Start server
app.listen(PORT, function() {

    console.log("CreamChills server running on:");
    console.log("http://localhost:3000");

});