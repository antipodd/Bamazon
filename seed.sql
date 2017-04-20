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