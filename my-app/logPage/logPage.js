const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define path to SQLite database file
// const dbPath = path.join('C:', 'Users', 'dariu', 'Desktop', 'New folder', 'my-app', 'dataBase', 'data.db');
const dbPath = path.join('E:', 'projects', 'applications', 'Electron-Projects', 'Electron-Project', 'my-app', 'dataBase', 'data.db');

function showAlert(message, callback) {
    document.getElementById('alert-message').textContent = message;
    document.getElementById('alert-box').style.display = 'block';
    document.getElementById('alert-ok').onclick = function() {
        document.getElementById('alert-box').style.display = 'none';
        callback();
    };
}
// Open SQLite database connection
let db = new sqlite3.Database(dbPath);

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
            /// check if the user is admin or not by veryfing if id is 1 or not
            if (row.id === 1) {
                alert('Logged in successfully as admin!');
                localStorage.setItem('current user id', row.id);
                window.location.href = '../adminPages/adminPage.html';
            } else {
                alert('Logged in successfully as user!');
                localStorage.setItem('current user id', row.id);
                window.location.href = '../mainPage/index.html';
            }

        } else {
            
            // Show an alert if the username and password are incorrect
            showAlert('Username or password is incorrect', () => {
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
            });
            
        }
    });
});

/// rewrite the code so that I can press on the username and password boxes to write into them after in elert

document.getElementById('create-account-btn').addEventListener('click', () => {
    // Navigate to the create account page
    window.location.href = 'createAccount.html';
});

});