const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define path to SQLite database file
const dbPath = path.join('E:', 'projects', 'applications', 'Electron-Projects', 'Electron-Project', 'my-app', 'dataBase', 'data.db');

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

    db.all('SELECT * FROM games', [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }

        let gamesTable = document.getElementById('games-table');

        rows.forEach((row) => {
            let tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${row.id}</td>
                <td>${row.name}</td>
                <td>${row.description}</td>
            `;

            gamesTable.appendChild(tr);
        });
    });

    db.all('SELECT * FROM leaderboard', [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }

        let leaderboardTable = document.getElementById('leaderboard-table');

        rows.forEach((row) => {
            let tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${row.name}</td>
                <td>${row.score}</td>
                <td>${row.user_id}</td>
            `;

            leaderboardTable.appendChild(tr);
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

function deleteGame(id) {
    db.run('DELETE FROM games WHERE id = ?', [id], (err) => {
        if (err) {
            return console.error(err.message);
        }

        location.reload();
    });
}

function deleteLeaderboard(id) {
    db.run('DELETE FROM leaderboard WHERE id = ?', [id], (err) => {
        if (err) {
            return console.error(err.message);
        }

        location.reload();
    });
}

function addGame() {
    let name = document.getElementById('game-name').value;
    let description = document.getElementById('game-description').value;

    db.run('INSERT INTO games(name, description) VALUES(?, ?)', [name, description], (err) => {
        if (err) {
            return console.error(err.message);
        }

        location.reload();
    });
}

function addLeaderboard() {
    let name = document.getElementById('leaderboard-name').value;
    let score = document.getElementById('leaderboard-score').value;
    let game_id = document.getElementById('leaderboard-game-id').value;

    db.run('INSERT INTO leaderboard(name, score, game_id) VALUES(?, ?, ?)', [name, score, game_id], (err) => {
        if (err) {
            return console.error(err.message);
        }

        location.reload();
    });
}

function addAccount() {
    let name = document.getElementById('account-name').value;
    let password = document.getElementById('account-password').value;
    let email = document.getElementById('account-email').value;

    db.run('INSERT INTO accounts(name, password, email) VALUES(?, ?, ?)', [name, password, email], (err) => {
        if (err) {
            return console.error(err.message);
        }

        location.reload();
    });
}

