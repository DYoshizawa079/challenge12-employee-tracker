const mysql = require('mysql2');
const fs = require("fs");

const prompts = require('./functions/prompts.js');
require('dotenv').config();

// Set up and test connection to MySQL database
const connection = mysql.createConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PW,
});
const connect = async () => {

    // Make the connection
    connection.connect((err) => {
        if(err) {
            console.log(err);
        }
    });

    // Load the seed queries
    const dbQuery = await fs.readFileSync("db/db.sql").toString();
    const dbQueryArr = dbQuery.toString().split(';');

    const seedQuery = await fs.readFileSync("db/schema.sql").toString();
    const seedQueryArr = seedQuery.toString().split(');');

    const seedQuery2 = await fs.readFileSync("db/seeds.sql").toString();
    const seedQueryArr2 = seedQuery2.toString().split(');');

    // Run each file line by line
    dbQueryArr.forEach((query) => {
        if(query) {
            // Add the delimiter back to each query before you run them
            query += ';';
            connection.query(query, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    });
    seedQueryArr.forEach((query) => {
        if(query) {
            // Add the delimiter back to each query before you run them
            query += ');';
            connection.query(query, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    });
    seedQueryArr2.forEach((query) => {
        if(query) {
            // Add the delimiter back to each query before you run them
            query += ');';
            connection.query(query, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    });

    // Load the inquirer prompts
    prompts(connection);
    
}
connect();



