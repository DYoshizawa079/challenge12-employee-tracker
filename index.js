//console.log("hello");

const mysql = require('mysql2');
const fs = require("fs");
const inquirer = require('inquirer');
require('dotenv').config();

// Set up and test connection to MySQL database
const connection = mysql.createConnection({
    //host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    //database: process.env.DB_NAME
});
const connect = async () => {

    // Make the connection
    connection.connect((err) => {
        if(err) {
            console.log(err);
        }
        console.log("Connected");
    });

    // Load the seed queries
    const dbQuery = await fs.readFileSync("db/db.sql").toString();
    //console.log(seedQuery);
    const dbQueryArr = dbQuery.toString().split(';');

    const seedQuery = await fs.readFileSync("db/schema.sql").toString();
    //console.log(seedQuery);
    const seedQueryArr = seedQuery.toString().split(');');

    const seedQuery2 = await fs.readFileSync("db/seeds.sql").toString();
    //console.log(seedQuery);
    const seedQueryArr2 = seedQuery2.toString().split(');');

    // Run the queries
    /* connection.query("CREATE DATABASE IF NOT EXISTS challenge12_employee_tracker", (err) => {
        console.log(err);
    });
    connection.query("USE challenge12_employee_tracker", (err) => {
        console.log(err);
    }); */

    // Run each file line by line
    dbQueryArr.forEach((query) => {
        if(query) {
            // Add the delimiter back to each query before you run them
            query += ';';
            connection.query(query, (err) => {
                console.log(err);
            })
        }
    });
    seedQueryArr.forEach((query) => {
        if(query) {
            // Add the delimiter back to each query before you run them
            query += ');';
            connection.query(query, (err) => {
                console.log(err);
            })
        }
    });
    seedQueryArr2.forEach((query) => {
        if(query) {
            // Add the delimiter back to each query before you run them
            query += ');';
            connection.query(query, (err) => {
                console.log(err);
            })
        }
    });

    // Inquirer prompt
    inquirer.prompt([
        {
            type: "list",
            name: "Options",
            message: "What would you like to do?",
            choices: ["view all departments", 
                "view all roles", 
                "view all employees", 
                "add a department", 
                "add a role", 
                "add an employee", 
                "and update an employee role"]
        }
    ]).then(
        function (response) {
            console.log(response.Options);
            if(response.Options === 'view all departments') {
                connection.query("SELECT * FROM department", (err, result) => {
                    console.log(err);
                    console.table(result);
                });
            }
            if(response.Options === 'view all roles') {
                connection.query("SELECT * FROM role", (err, result) => {
                    console.log(err);
                    console.table(result);
                });
            }
            if(response.Options === 'view all employees') {
                connection.query("SELECT * FROM employee", (err, result) => {
                    console.log(err);
                    console.table(result);
                });
            }
        }
    );
}
connect();



