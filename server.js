// Required modules
const inquirer = require("inquirer");
const mysql = require("mysql2");
const dotenv = require('dotenv').config();
const consoleTable = require("console.table");

// Create MySQL connection using credentials from .env file
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});