//require MySQL
var mysql = require("mysql");
//require inquirer
var inquirer = require("inquirer");

//set up connection configuration
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "Bamazon"
});

//connect to database Bamazon
connection.connect(function(err) {
	if(err) {
		console.log(err);
	} /*else {
		console.log("connected as id " + connection.threadId);
	}*/

});
//give manager list of options
inquirer.prompt([
	{
		type: "list",
				message: "What would you like to do?",
				choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
				name: "managerOptions"
	}
]).then(function(options) {
	//determine what is done based on input
	switch(options.managerOptions) {
		case "View Products for Sale":
			viewProducts();
			break;
		case "View Low Inventory":
			viewLowInventory();
			break;
		case "Add to Inventory":
			addToInventory();
			break;
		case "Add New Product":
			addNewProduct();
			break;
	}
});

function viewProducts() {
	//get all information from products table
	var sqlSequence = "SELECT item_id, product_name, price, stock_quantity FROM products";

	connection.query(sqlSequence, function(error, response) {
		if(error) {
			console.log(error);
		} else {
			//console.log(response);
			for (var i = 0; i < response.length; i++) {
				console.log(response[i].item_id + " | " + response[i].product_name + " | " + response[i].price + " | " + response[i].stock_quantity);
			}
		}
	});
};

function viewLowInventory() {
	//get product names and stock quantities from products
	var sqlSequence = "SELECT product_name, stock_quantities FROM products";

	connection.query(sqlSequence, function(error, response) {
		if(error) {
			console.log(error);
		} else {
			//console.log(response);
			for (var i = 0; i < response.length; i++) {
				if (response[i].stock_quantity < 5) {
					console.log(response[i].product_name);
				}
			}
		}
	});
};

function addToInventory() {
	var sqlSequence = "SELECT product_name, stock_quantities FROM products";
	var productArray = [];
	connection.query(sqlSequence, function(error, response) {
		if(error) {
			console.log(error);
		} else {
			//console.log(response);
			for (var i = 0; i < response.length; i++) {
				productArray.push(response[i].product_name);
			}
		}
	});
	inquirer.prompt([
		{
			type: "list",
			message: "Select the item to which more stock will be added",
			choices: productArray,
			name: "products"
		},
		{
			type: "input",
			message: "How many do you want to add?",
			name: "quantity"
		}
	]).then(function(options) {
		//determine what is done based on input
		connection.query("UPDATE products SET ? WHERE ?", [{
			stock_quantity: response[0].stock_quantity + parseInt(options.quantity)
			}, {
			product_name: options.products
			}], function(err, res) {
			console.log("The quantity of " + options.products + " was successfully changed!");
		});
	});
};

function addNewProduct() {
	inquirer.prompt([
		{
			type: "input",
			message: "What item do you want to add to the store?",
			name: "newItemName"
		},
		{
			type: "input",
			message: "In which department will this item be sold?",
			name: "newItemDepartment"
		},
		{
			type: "input",
			message: "How much will the item cost?",
			name: "newItemCost"
		},
		{
			type: "input",
			message: "How much will be in stock?",
			name: "newItemStock"
		},
		{
			type: "confirm",
			message: "Are you sure?",
			name: "confirm",
			default: true
		}
	]).then(function(newItem) {
		if (user.confirm) {
			connection.query("INSERT INTO products SET ?", {
				product_name: newItem.newItemName,
				department_name: newItem.newItemDepartment,
				price: parseInt(newItem.newItemCost),
				stock_quantity: parseInt(newItem.newItemStock)
			}, function(err, res) {
				console.log("You have successfully added " + newItem.newItemName + " to the store!")
			});
		}
	});
}
