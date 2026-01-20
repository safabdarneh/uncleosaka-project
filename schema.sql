CREATE DATABASE IF NOT EXISTS uncle_osaka_db;
USE uncle_osaka_db;

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(120) NOT NULL,
  customer_phone VARCHAR(30) NOT NULL,
  customer_notes TEXT,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  drinkname VARCHAR(100) NOT NULL,
  sizename VARCHAR(20) NOT NULL,
  addons TEXT,
  qty INT NOT NULL,
  unitprice DECIMAL(10,2) NOT NULL,
  linetotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  message TEXT,
  created_at DATETIME NOT NULL
);



USE uncle_osaka_db;
SELECT * FROM orders ORDER BY id DESC;
SELECT * FROM order_items ORDER BY id DESC;
SELECT * FROM contacts ORDER BY id DESC;



