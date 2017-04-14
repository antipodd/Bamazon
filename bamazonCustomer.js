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
//create an empty array that will store the name of all products available to purchase
var productsArray = [];

//pull stock from Bamazon database
var sqlSequence = "SELECT item_id, product_name, price FROM products";

connection.query(sqlSequence, function(error, response) {
	if(error) {
		console.log(error);
	} else {
		//console.log(response);
		for (var i = 0; i < response.length; i++) {
			console.log(response[i].item_id + " | " + response[i].product_name + " | " + response[i].price);
			//populate array
			productsArray.push(response[i].product_name);
		}
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
			connection.query("SELECT stock_quantity, price FROM products WHERE ?", [{
				product_name: userSelection
			}], function(error, response) {
				console.log(response[0].stock_quantity);
				//console.log(response);
				if(error) {
					console.log(error);
				} else if (response[0].stock_quantity < parseInt(order.quantity)) {
					//check for sufficient stock;
					console.log("Insufficient quantity! Your order was not placed, please try again.");
				} else {
					connection.query("UPDATE products SET ? WHERE ?", [{
						stock_quantity: response[0].stock_quantity - parseInt(order.quantity)
					}, {
						product_name: order.selection
					}], function(err, res) {
					console.log("Your order was successfully placed!");
					console.log("The total cost of your order is $" + (response[0].price * parseInt(order.quantity)));
					});
				}
			});
		});
	} else {
		console.log("Have a nice day!");
	}
});

    
