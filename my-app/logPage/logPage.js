const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define path to SQLite database file
const dbPath = path.join('E:', 'projects', 'applications', 'Electron-Projects', 'my-app', 'dataBase', 'data.db');

// Open SQLite database connection
let db = new sqlite3.Database(dbPath);

// Create a table if it doesn't exist
db.run('CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY, name TEXT, password TEXT, email TEXT)');


document.addEventListener('DOMContentLoaded', (event) => {

document.getElementById('login-btn').addEventListener('click', () => {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    // Query the database for the entered username and password
    db.get('SELECT * FROM accounts WHERE name = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (row) {
            alert('Logged in successfully!');
            window.location.href = '../mainPage/index.html';
        } else {
            alert('Invalid username or password!');
            setTimeout(() => {
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
                document.getElementById('username').focus();
            }, 100);
        }
    });
});

/// rewrite the code so that I can press on the username and password boxes to write into them after in elert

document.getElementById('create-account-btn').addEventListener('click', () => {
    // Navigate to the create account page
    window.location.href = 'createAccount.html';
});

});