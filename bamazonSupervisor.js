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

function menuOptions() {
	inquirer.prompt([
		{
			type: "list",
			message: "What would you like to do?",
			choices: ["View Product Sales by Department", "Create New Department", "Exit"],
			name: "menuOptions"
		}
	]).then(function(options) {
		switch(options.menuOptions) {
			case "View Product Sales by Department":
				viewSales();
				break;
			case "Create New Department":
				createNewDepartment();
				break;
			case "Exit":
				console.log("Have a nice day");
				break;
		}
	});
}

function viewSales() {
	var salesArray = [];
	connection.query("SELECT department_id, department_name, over_head_costs, product_sales, (product_sales - over_head_costs) AS total_profit FROM departments", 
		function(error, response) {
				/*for (var i = 0; i < response.length; i++) {
					console.log(response[i].department_id + " | " + response[i].department_name + " | " + response[i].over_head_costs + " | " + response[i].product_sales + " | " + response[i].total_profit);
				}*/
				for (var i = 0; i < response.length; i++) {
					var salesObject = {
										department_id: response[i].department_id,
										department_name: response[i].department_name,
										over_head_costs: response[i].over_head_costs,
										product_sales: response[i].product_sales,
										total_profit: response[i].total_profit
					};
					salesArray.push(salesObject);
				}
				console.table(salesArray);
				menuOptions();
			});
}

function createNewDepartment() {
	inquirer.prompt([
		{
			type: "input",
			message: "What is the name of the department you want to add to the store?",
			name: "newDepartmentName"
		},
		{
			type: "input",
			message: "What are the over head costs of this department?",
			name: "newDepartmentCosts"
		},
		{
			type: "confirm",
			message: "Are you sure?",
			name: "confirm",
			default: true
		}
	]).then(function(newDepartment) {
		if (newDepartment.confirm) {
			connection.query("INSERT INTO departments SET ?", {
				department_name: newDepartment.newDepartmentName,
				over_head_costs: newDepartment.newDepartmentCosts,
				product_sales: 0
			}, function(err, res) {
				console.log("You have successfully added the " + newDepartment.newDepartmentName + " department to the store!");
				menuOptions();
			});
		}
	});
}

menuOptions()