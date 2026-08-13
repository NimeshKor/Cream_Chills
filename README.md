#  CreamChills - Online Ice Cream Ordering System

CreamChills is a simple college-level web project for ordering ice cream online.

The project demonstrates how a frontend, backend, REST API and PostgreSQL database can work together.

This is a practice project to learn and try the HTML, CSS, JAVASCRIPT and POSTGRESQL we learned in the value added course provided by SIES GST

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- PostgreSQL

## Features

- View available ice cream products
- Add products to cart
- Increase/decrease quantity
- Place an order
- Generate a unique Order ID
- Store orders in PostgreSQL
- Track order status
- Simple admin login
- Admin can view orders
- Admin can update order status

## Order Status

Order Placed → Confirmed → Preparing → Out for Delivery → Delivered

## Project Structure

```text
Cream_chills/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── database.sql
├── .gitignore
└── README.md