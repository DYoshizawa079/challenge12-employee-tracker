const inquirer = require('inquirer');

const actions = function(response, connection){
    console.log(response.Options);
    if(response.Options === 'view all departments') {
        connection.query("SELECT * FROM department", (err, result) => {
            console.log(err);
            console.table(result);
            prompts(connection);
        });
    }
    if(response.Options === 'view all roles') {
        connection.query("SELECT * FROM role", (err, result) => {
            console.log(err);
            console.table(result);
            prompts(connection);
        });
    }
    if(response.Options === 'view all employees') {
        connection.query("SELECT * FROM employee", (err, result) => {
            console.log(err);
            console.table(result);
            prompts(connection);
        });
    }
    if(response.Options === 'add a department') {

        const departmentInput = async() => {
            const answer = await inquirer.prompt([
                {
                    type: "input",
                    name: "department",
                    message: "Enter the name of the new department"
                }
            ])
            console.log(answer);
            connection.query('INSERT INTO department (name) VALUES ("' + answer.department + '");', (err) => {
                console.log(err);
            });
            prompts(connection);
        }
        departmentInput();
        
    }
    if(response.Options === 'add a role') {

        const roleInput = async() => {
            const answer = await inquirer.prompt([
                {
                    type: "input",
                    name: "role",
                    message: "Enter the name of the new role"
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Enter the salary for the new role"
                },
                {
                    type: "input",
                    name: "department",
                    message: "Enter the department that the new role pertains to"
                }
            ])
            console.log(answer);
            connection.query('INSERT INTO role (name, salary, department_id) VALUES ("' + answer.role + '",' + answer.salary + ',' + answer.department + ');', (err) => {
                console.log(err);
            });
            prompts(connection);
        }
        roleInput();
        
    }
    if(response.Options === 'add an employee') {

        const employeeInput = async() => {
            const answer = await inquirer.prompt([
                {
                    type: "input",
                    name: "first_name",
                    message: "Enter the first name of the employee"
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "Enter the last name of the employee"
                },
                {
                    type: "input",
                    name: "role",
                    message: "Enter the role that is assigned to the employee"
                },
                {
                    type: "input",
                    name: "manager",
                    message: "Enter the manager that the employee needs to report to"
                }
            ])
            console.log(answer);
            connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("' + answer.first_name + '", "' + answer.last_name + '", ' + answer.role + ',' + answer.manager + ');', (err) => {
                console.log(err);
            });
            prompts(connection);
        }
        employeeInput();
        
    }

}

const prompts = function (connection) {
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
    ]).then( function(response) {
            actions(response, connection);
        }
    );
}

module.exports = prompts;