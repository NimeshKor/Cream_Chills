-- CreamChills Database

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    available BOOLEAN DEFAULT TRUE
);


-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    payment VARCHAR(30),
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Order Placed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Items inside each order
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,

    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);


-- Sample ice creams
INSERT INTO products
(name, description, price, category)
VALUES
('Chocolate Fudge', 'Rich chocolate ice cream with fudge', 120, 'Chocolate'),

('Vanilla Dream', 'Classic creamy vanilla ice cream', 100, 'Vanilla'),

('Strawberry Bliss', 'Sweet strawberry flavoured ice cream', 110, 'Strawberry'),

('Mango Magic', 'Refreshing mango ice cream', 130, 'Mango'),

('Cookies & Cream', 'Vanilla ice cream with cookie pieces', 140, 'Cookies'),

('Butterscotch Crunch', 'Creamy butterscotch with crunchy bits', 130, 'Butterscotch');