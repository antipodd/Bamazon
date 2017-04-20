-- Creates the "Bamazon" database --
CREATE DATABASE Bamazon;
-- Makes it so all of the following code will affect Bamazon --
USE Bamazon;
-- Creates the table "products" within Bamazon --
CREATE TABLE products (
  -- Creates a numeric column called "id" which automatically increments and cannot be null --
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  -- Makes a string column called "product_id" which cannot contain null --
  product_name VARCHAR(50) NOT NULL,
  -- Makes a string column called "department_name" which cannot contain null --
  department_name VARCHAR(50) NOT NULL,
  -- Makes a numeric column called "price" --
  price INTEGER(10),
  -- Makes a numeric column called "stock_quantity" --
  stock_quantity INTEGER(10),
  PRIMARY KEY (item_id)
);

CREATE TABLE departments (
  department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  over_head_costs INTEGER(11) NOT NULL,
  product_sales INTEGER(11),
  PRIMARY KEY (department_id)
);