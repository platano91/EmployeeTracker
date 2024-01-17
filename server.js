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