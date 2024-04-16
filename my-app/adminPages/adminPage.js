const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define path to SQLite database file
const dbPath = path.join('C:', 'Users', 'dariu', 'Desktop', 'New folder', 'my-app', 'dataBase', 'data.db');
//const dbPath = path.join('E:', 'projects', 'applications', 'Electron-Projects', 'Electron-Project', 'my-app', 'dataBase', 'data.db');
// Open SQLite database connection
let db = new sqlite3.Database(dbPath);

window.addEventListener('DOMContentLoaded', (event) => {
    // Query the database for all users
    db.all('SELECT * FROM accounts', [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }

        // Get a reference to the users table
        let usersTable = document.getElementById('users-table');

        // Add a row to the table for each user
        rows.forEach((row) => {
            let tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${row.id}</td>
                <td>${row.name}</td>
                <td>${row.email}</td>
                <td><button onclick="deleteUser(${row.id})">Delete</button></td>
            `;

            usersTable.appendChild(tr);
        });
    });
});

// Function to delete a user
function deleteUser(id) {
    db.run('DELETE FROM accounts WHERE id = ?', [id], (err) => {
        if (err) {
            return console.error(err.message);
        }

        // Reload the page to update the users table
        location.reload();
    });
}