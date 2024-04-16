const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join('E:', 'projects', 'applications', 'Electron-Projects', 'Electron-Project', 'my-app', 'dataBase', 'data.db');

let db = new sqlite3.Database(dbPath);

window.addEventListener('DOMContentLoaded', (event) => {

    db.all('SELECT * FROM leaderboard WHERE name = ? ORDER BY score DESC LIMIT 10', ['Snake'], (err, rows) => {
        if (err) {
            alert('Error' + err.message);
            return console.error(err.message);
        }

        let leaderboardTable = document.getElementById('snake-table');

        rows.forEach((row) => {
            let tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${row.name}</td>
                <td>${row.user_id}</td>
                <td>${row.score}</td>
            `;

            leaderboardTable.appendChild(tr);
        });
    });


    document.getElementById('back-button').addEventListener('click', () => {
        window.location.href = '../mainPage/index.html';
    }
    );

});
