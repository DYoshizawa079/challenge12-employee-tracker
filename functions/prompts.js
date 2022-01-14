const inquirer = require('inquirer');

// Get the list of all roles that is in the DB
let roleList = (connection) => {
    return new Promise((resolve, reject)=>{
        connection.query("SELECT * FROM role",  (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });
};

// Actions that are to be carried out according to the user's responses to the prompts
const actions = function(response, connection){
    if(response.Options === 'View all departments') {
        connection.query("SELECT * FROM department", (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.table(result);
            }
            prompts(connection);
        });
    }
    if(response.Options === 'View all roles') {
        connection.query("SELECT * FROM role", (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.table(result);
            }
            prompts(connection);
        });
    }
    if(response.Options === 'View all employees') {
        connection.query("SELECT * FROM employee", (err, result) => {
            if (err) {
                console.log(err);
            } else {
                console.table(result);
            }
            prompts(connection);
        });
    }
    if(response.Options === 'View all employees by manager') {

        const managerInput = async() => {
            const answer = await inquirer.prompt([
                {
                    type: "input",
                    name: "manager",
                    message: "Enter the ID number of the manager"
                }
            ])
            connection.query("SELECT * FROM employee WHERE manager_id = " + answer.manager, (err, result) => {
                if(err) {
                    console.log("You entered the wrong info.");
                } else {
                    console.table(result);
                }
                prompts(connection);
            });
        }
        managerInput();
    }
    if(response.Options === 'Add a department') {

        const departmentInput = async() => {
            const answer = await inquirer.prompt([
                {
                    type: "input",
                    name: "department",
                    message: "Enter the name of the new department"
                }
            ])
            connection.query('INSERT INTO department (name) VALUES ("' + answer.department + '");', (err) => {
                if (err) {
                    console.log(err);
                }
            });
            prompts(connection);
        }
        departmentInput();
        
    }
    if(response.Options === 'Add a role') {

        // Get the list of all departments that is in the DB
        let deptList = () => {
            return new Promise((resolve, reject)=>{
                connection.query("SELECT * FROM department",  (error, results)=>{
                    if(error){
                        return reject(error);
                    }
                    return resolve(results);
                });
            });
        };
        
        const roleInput = async() => {
            
            // Array that lists all of the info of the departments
            let departmentList = await deptList(); 

            // Array that lists only the names of the departments
            let departmentListNamearr = [];
            departmentList.forEach(function(item) {
                departmentListNamearr.push(item.name);
            })

            // Prompt the user
            const answer = await 
                
                inquirer.prompt([
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
                    type: "list",
                    name: "department",
                    message: "Enter the department that the new role pertains to",
                    choices: departmentListNamearr
                }
            ])

            // Discern the department ID number based on the user's response
            for (let i = 0; i < departmentList.length; i++) {
                if (answer.department === departmentList[i].name) {
                    answer.department = i + 1;
                }
            }

            connection.query('INSERT INTO role (name, salary, department_id) VALUES ("' + answer.role + '",' + answer.salary + ',' + answer.department + ');', (err) => {
                if (err) {
                    console.log(err);
                }
            });
            prompts(connection);
        }
        roleInput();
        
    }
    if(response.Options === 'Add an employee') {

        const employeeInput = async() => {

            // Array that lists all of the info of the roles
            let rolesList = await roleList(connection); 

            // Array that lists only the names of the roles
            let rolesListNamearr = [];
            rolesList.forEach(function(item) {
                rolesListNamearr.push(item.name);
            })

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
                    type: "list",
                    name: "role",
                    message: "Select the role that is assigned to the employee",
                    choices: rolesListNamearr
                },
                {
                    type: "input",
                    name: "manager",
                    message: "Enter the ID of the manager that the employee needs to report to"
                }
            ])

            // Discern the role ID number based on the user's response
            for (let i = 0; i < rolesList.length; i++) {
                if (answer.role === rolesList[i].name) {
                    answer.role = i + 1;
                }
            }

            connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("' + answer.first_name + '", "' + answer.last_name + '", ' + answer.role + ',' + answer.manager + ');', (err) => {
                if (err) {
                    console.log(err);
                }
            });
            prompts(connection);
        }
        employeeInput();
        
    }
    if(response.Options === 'Update an employee role') {

        const employeeInput = async() => {

             // Array that lists all of the info of the roles
            let rolesList = await roleList(connection); 

            // Array that lists only the names of the roles
            let rolesListNamearr = [];
            rolesList.forEach(function(item) {
                rolesListNamearr.push(item.name);
            }) 

            const answer = await inquirer.prompt([
                {
                    type: "input",
                    name: "id",
                    message: "Select the employee by his ID number"
                },
                {
                    type: "list",
                    name: "role_id",
                    message: "Select the new role that is assigned to the employee",
                    choices: rolesListNamearr
                }
            ])

            // Discern the role ID number based on the user's response
            for (let i = 0; i < rolesList.length; i++) {
                if (answer.role_id === rolesList[i].name) {
                    answer.role_id = i + 1;
                }
            }
            connection.query('UPDATE employee SET role_id = ' + answer.role_id + ' WHERE id = ' + answer.id , (err) => {
                if (err) {
                    console.log(err);
                }
            });
            prompts(connection);
        }
        employeeInput();
        
    }

}

// Inital prompts for the user
const prompts = function (connection) {
    inquirer.prompt([
        {
            type: "list",
            name: "Options",
            message: "What would you like to do?",
            choices: ["View all departments", 
                "View all roles", 
                "View all employees",
                "View all employees by manager", 
                "Add a department", 
                "Add a role", 
                "Add an employee", 
                "Update an employee role"]
        }
    ]).then( function(response) {
            actions(response, connection);
        }
    );
}

module.exports = prompts;