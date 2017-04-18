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
-- Insert values into table products --
INSERT INTO products (
	product_name,
    department_name,
    price,
    stock_quantity
) VALUES 
	("Infinity Stones", "Collectables", 2000000, 6),
    ("Deadpool's Guide to Super Villains Cards", "Collectables", 50, 100),
    ("Nuts", "Food", 4, 260),
    ("Iron Man Armor", "Weapons and Armor", 100000, 3),
    ("Infinity Gauntlet", "Odds and Ends", 5, 1),
    ("Unmovable Hammer", "Odds and Ends", 10, 1),
    ("Adamantium", "Metals and Stuff", 100, 3000),
    ("Arc Reactor", "Weapons and Armor", 30000, 17),
    ("Katanas", "Weapons and Armor", 5000, 2),
    ("Shawarma", "Food", 3, 130)
;

SELECT
item_id,
product_name,
price,
department_name
FROM
products
;

SELECT
stock_quantity
FROM
products
WHERE
product_name = "Nuts"
;

SELECT
*
FROM
products
WHERE
product_name = "Nuts"
;

CREATE TABLE departments (
	department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs INTEGER(11) NOT NULL,
    product_sales INTEGER(11),
    PRIMARY KEY (department_id)
);

INSERT INTO departments (
	department_name,
    over_head_costs,
    product_sales
) VALUES 
	("Collectables", 200, 0),
    ("Food", 50, 0),
    ("Weapons and Armor", 10000, 0),
    ("Odds and Ends", 5000, 0),
    ("Metals and Stuff", 500, 0)
;
