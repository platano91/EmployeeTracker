// Required modules
const inquirer = require("inquirer");
const mysql = require("mysql2");
const dotenv = require('dotenv').config();
const consoleTable = require("console.table");

// MySQL connection using credentials from .env
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Connection to database
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the Employee Tracker database.');
    mainMenu();
});

// Main menu function
function mainMenu() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
            'Exit'
        ]
    })
    .then(answer => {
        switch (answer.action) {
            case 'View All Departments':
                viewAllDepartments();
                break;
            // Add cases for other actions
            case 'Exit':
                connection.end();
                break;
            default:
                console.log(`Invalid action: ${answer.action}`);
                mainMenu();
                break;
        }
    });
}

// Function to view all departments
async function viewAllDepartments() {
    try {
        const query = 'SELECT * FROM departments';
        const [rows] = await connection.promise().query(query);
        console.table(rows);
    } catch (error) {
        console.error(error);
    } finally {
        mainMenu();
    }
}

// Function to view all roles
async function viewAllRoles() {
    try {
        const query = 'SELECT * FROM roles';
        const [rows] = await connection.promise().query(query);
        console.table(rows);
    } catch (error) {
        console.error(error);
    } finally {
        mainMenu();
    }
}

// Function to view all employees
async function viewAllEmployees() {
    try {
        const query = 'SELECT * FROM employees';
        const [rows] = await connection.promise().query(query);
        console.table(rows);
    } catch (error) {
        console.error(error);
    } finally {
        mainMenu();
    }
}

// Function to add a department
async function addDepartment() {
    try {
        const { departmentName } = await inquirer.prompt({
            name: 'departmentName',
            type: 'input',
            message: 'What is the name of the department?'
        });

        const query = 'INSERT INTO departments (name) VALUES (?)';
        await connection.promise().query(query, departmentName);
        console.log(`Added ${departmentName} to the database`);
    } catch (error) {
        console.error(error);
    } finally {
        mainMenu();
    }
}

// Function to add a role
async function addRole() {
    try {
        // Prompting for role details
        const { roleName, salary, departmentId } = await inquirer.prompt([
            {
                name: 'roleName',
                type: 'input',
                message: 'What is the name of the role?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary for this role?',
                validate: value => !isNaN(value) // Ensures input is a number
            },
            {
                name: 'departmentId',
                type: 'input',
                message: 'What is the department ID for this role?',
                validate: value => !isNaN(value) // Ensures input is a number
            }
        ]);

        // Inserting the role into the database
        const query = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
        await connection.promise().query(query, [roleName, salary, departmentId]);
        console.log(`Added ${roleName} role to the database`);
    } catch (error) {
        console.error(error);
    } finally {
        mainMenu();
    }
}

// Function to add an employee
async function addEmployee() {
    try {
        // Prompting for employee details
        const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the employee\'s first name?'
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the employee\'s last name?'
            },
            {
                name: 'roleId',
                type: 'input',
                message: 'What is the role ID for this employee?',
                validate: value => !isNaN(value) // Ensures input is a number
            },
            {
                name: 'managerId',
                type: 'input',
                message: 'What is the manager ID for this employee? (Enter 0 if no manager)',
                validate: value => !isNaN(value) // Ensures input is a number
            }
        ]);

        // Handling no manager case
        const managerIdValue = managerId === 0 ? null : managerId;

        // Inserting the employee into the database
        const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
        await connection.promise().query(query, [firstName, lastName, roleId, managerIdValue]);
        console.log(`Added ${firstName} ${lastName} to the database`);
    } catch (error) {
        console.error(error);
    } finally {
        mainMenu();
    }
}

// Function to update an employee role
async function updateEmployeeRole() {
    try {
        // Fetching employees and roles from the database
        const employeesQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees';
        const rolesQuery = 'SELECT id, title FROM roles';

        const [employees] = await connection.promise().query(employeesQuery);
        const [roles] = await connection.promise().query(rolesQuery);

        // Formatting for inquirer choices
        const employeeChoices = employees.map(employee => ({ name: employee.name, value: employee.id }));
        const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

        // Prompting to select employee and new role
        const { employeeId, roleId } = await inquirer.prompt([
            {
                name: 'employeeId',
                type: 'list',
                message: 'Which employee\'s role do you want to update?',
                choices: employeeChoices
            },
            {
                name: 'roleId',
                type: 'list',
                message: 'What is the new role?',
                choices: roleChoices
            }
        ]);

        // Updating the employee's role in the database
        const updateQuery = 'UPDATE employees SET role_id = ? WHERE id = ?';
        await connection.promise().query(updateQuery, [roleId, employeeId]);

        console.log('Employee role updated successfully');
    } catch (error) {
        console.error(error);
    } finally {
        mainMenu();
    }
}

// Start the application
mainMenu();