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