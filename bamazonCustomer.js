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
//create an empty array that will store the name of all products available to purchase
var productsArray = [];
var productViewArray = [];

//pull stock from Bamazon database
var sqlSequence = "SELECT item_id, product_name, price FROM products";

connection.query(sqlSequence, function(error, response) {
	if(error) {
		console.log(error);
	} else {
		//console.log(response);
		for (var i = 0; i < response.length; i++) {
			var productsObject = {
				item_id: response[i].item_id,
				product_name: response[i].product_name,
				price: response[i].price
			}

			//console.log(response[i].item_id + " | " + response[i].product_name + " | " + response[i].price);
			//populate arrays
			productsArray.push(response[i].product_name);
			productViewArray.push(productsObject);
		}
		console.table(productViewArray);
	}
});

inquirer.prompt([

  // Confirm customer wants to buy stuff
  {
    type: "confirm",
    message: "Would you like to purchase any of the items shown?",
    name: "confirm",
    default: true
  }
]).then(function(user) {
	if(user.confirm) {
		inquirer.prompt([
			//ask user what they want to buy
			{
				type: "list",
				message: "What would you like to purchase today?",
				choices: productsArray,
				name: "selection"
			},
			{
				type: "input",
    			message: "Please input quantity desired",
    			name: "quantity"
			}
		]).then(function(order) {
			var userSelection = order.selection;
			connection.query("SELECT stock_quantity, price, department_name FROM products WHERE ?", [{
				product_name: userSelection
			}], function(error, response) {
				console.log(response[0].stock_quantity);
				console.log(response[0].department_name);
				//console.log(response);
				if(error) {
					console.log(error);
				} else if (response[0].stock_quantity < parseInt(order.quantity)) {
					//check for sufficient stock;
					console.log("Insufficient quantity! Your order was not placed, please try again.");
				} else {
					var totalPrice = response[0].price * parseInt(order.quantity);
					connection.query("UPDATE products SET ? WHERE ?", [{
						stock_quantity: response[0].stock_quantity - parseInt(order.quantity)
					}, {
						product_name: order.selection
					}], function(err, res) {
					console.log("Your order was successfully placed!");
					//totalPrice = response[0].price * parseInt(order.quantity);
					console.log("The total cost of your order is $" + totalPrice);
					});
					connection.query("UPDATE departments SET product_sales=product_sales+" + totalPrice + " WHERE ?", {
						department_name: response[0].department_name
					}, function(err, res) {});
				}
			});
		});
	} else {
		console.log("Have a nice day!");
	}
});

    
