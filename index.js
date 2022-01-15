const mysql = require('mysql2');
const fs = require("fs");

const prompts = require('./functions/prompts.js');
require('dotenv').config();

// Set up and test connection to MySQL database
const connection = mysql.createConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PW,
});

// Process the mysql and seed files
/* Function passes statements line by line into a .query() method
For some reason, .query() doesn't handle multiple lines at once */
const runDbQueries = function(dbQuery, delimiter) {
    let dbQueryArray = dbQuery.toString().split(delimiter);
    dbQueryArray.forEach((query) => {
        if(query) {
            // Add the delimiter back to each query before you run them
            query += delimiter;
            connection.query(query, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    });
}


const connect = async () => {

    // Make the connection
    connection.connect((err) => {
        if(err) {
            console.log(err);
        }
    });

    // Load the mysql and seed files
    const dbQuery = await fs.readFileSync("db/db.sql").toString();
    const seedQuery = await fs.readFileSync("db/schema.sql").toString();
    const seedQuery2 = await fs.readFileSync("db/seeds.sql").toString();

    // Process the seed queries. The second parameter is for the delimiter that splits each line in their respective mysql and seed files
    runDbQueries(dbQuery, ';');
    runDbQueries(seedQuery, ');');
    runDbQueries(seedQuery2, ');');

    // Load the inquirer prompts
    prompts(connection);
    
}
connect();



