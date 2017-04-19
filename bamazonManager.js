//require MySQL
var mysql = require("mysql");
//require inquirer
var inquirer = require("inquirer");
//require console.table
require("console.table");

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
function userPrompt() {
	inquirer.prompt([
		{
			type: "list",
					message: "What would you like to do?",
					choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
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
			case "Exit":
				console.log("Goodbye");
				break;
		}
	});
}

function viewProducts() {
	var productsArray = [];
	//get all information from products table
	var sqlSequence = "SELECT item_id, product_name, price, stock_quantity FROM products";

	connection.query(sqlSequence, function(error, response) {
		if(error) {
			console.log(error);
		} else {
			//console.log(response);
			/*for (var i = 0; i < response.length; i++) {
				console.log(response[i].item_id + " | " + response[i].product_name + " | " + response[i].price + " | " + response[i].stock_quantity);
			}*/
			for (var i = 0; i < response.length; i++) {
				var productsObject = {
										item_id: response[i].item_id,
										product_name: response[i].product_name,
										price: response[i].price,
										stock_quantity: response[i].stock_quantity,
				};
				productsArray.push(productsObject);
			}
				console.table(productsArray);
				userPrompt();
		}
		
	})/*.then(function() {
		userPrompt();
	})*/;
	//userPrompt();
};

function viewLowInventory() {
	var lowInventoryArray = [];
	//get product names and stock quantities from products
	var sqlSequence = "SELECT product_name, stock_quantity FROM products";

	connection.query(sqlSequence, function(error, response) {
		if(error) {
			console.log(error);
		} else {
			//console.log(response);
			/*for (var i = 0; i < response.length; i++) {
				if (response[i].stock_quantity < 5) {
					console.log(response[i].product_name);
				}
			}*/
			for (var i = 0; i < response.length; i++) {
				if (response[i].stock_quantity < 5) {
					var lowInventoryObject = {
						product_name: response[i].product_name,
						stock_quantity: response[i].stock_quantity
					};
					lowInventoryArray.push(lowInventoryObject);
				}
			}
			console.table(lowInventoryArray);
			userPrompt();
		}
		
	});
	//userPrompt();
};

function addToInventory() {
	var sqlSequence = "SELECT product_name, stock_quantity FROM products";
	var productArray = [];
	connection.query(sqlSequence, function(error, response) {
		if(error) {
			console.log(error);
		} else {
			//console.log(response);
			for (var i = 0; i < response.length; i++) {
				var productName = response[i].product_name;
										
				productArray.push(productName);
			}
		}
	});
	inquirer.prompt([
		{
			type: "confirm",
			message: "Was a shipment received today?",
			name: "confirm",
			default: true
		},
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
		var product = options.products;

		connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE ?", [
			parseInt(options.quantity),
			{
			product_name: options.products
			}], function(err, res) {
			console.log("The quantity of " + options.products + " was successfully changed!");
			userPrompt();
		});
	});
	//userPrompt();
};

function addNewProduct() {
	//not allowing the manager to create a new department, need to grab existing department names from departments table
	var departmentsArray = [];
	connection.query("SELECT department_name FROM departments", 
		function(error, response) {
				for (var i = 0; i < response.length; i++) {
					var department = response[i].department_name;										
					departmentsArray.push(department);
				}
				
	});

	inquirer.prompt([
		{
			type: "input",
			message: "What item do you want to add to the store?",
			name: "newItemName"
		},
		{
			type: "list",
			message: "In which department will this item be sold?",
			choices: departmentsArray,
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
		if (newItem.confirm) {
			connection.query("INSERT INTO products SET ?", {
				product_name: newItem.newItemName,
				department_name: newItem.newItemDepartment,
				price: parseInt(newItem.newItemCost),
				stock_quantity: parseInt(newItem.newItemStock)
			}, function(err, res) {
				console.log("You have successfully added " + newItem.newItemName + " to the store!");
				userPrompt();
			});
		}
	});
	//userPrompt();
}

userPrompt();