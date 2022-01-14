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
    if(response.Options === 'view all employees by manager') {

        const managerInput = async() => {
            const answer = await inquirer.prompt([
                {
                    type: "input",
                    name: "manager",
                    message: "Enter the ID number of the manager"
                }
            ])
            console.log(answer);
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

        let deptList = () => {
            return new Promise((resolve, reject)=>{
                connection.query("SELECT * FROM department",  (error, results)=>{
                    if(error){
                        return reject(error);
                    }
                    console.log(results);
                    return resolve(results);
                });
            });
        };
        
        const roleInput = async() => {
            
            let departmentList = await deptList(); 
            let departmentListIDarr = [];
            departmentList.forEach(function(item, index) {
                departmentListIDarr.push(item.name);
            })
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
                    choices: departmentListIDarr
                }
            ])
            console.log(answer);
            for (let i = 0; i < departmentList.length; i++) {
                if (answer.department === departmentList[i].name) {
                    answer.department = i + 1;
                }
            }
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
    if(response.Options === 'update an employee role') {

        const employeeInput = async() => {
            const answer = await inquirer.prompt([
                {
                    type: "input",
                    name: "id",
                    message: "Select the employee by his ID number"
                },
                {
                    type: "input",
                    name: "role_id",
                    message: "Enter the employee's new role by its ID number"
                }
            ])
            console.log(answer);
            connection.query('UPDATE employee SET role_id = ' + answer.role_id + ' WHERE id = ' + answer.id , (err) => {
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
                "view all employees by manager", 
                "add a department", 
                "add a role", 
                "add an employee", 
                "update an employee role"]
        }
    ]).then( function(response) {
            actions(response, connection);
        }
    );
}

module.exports = prompts;