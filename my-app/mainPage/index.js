const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { Database } = require('sqlite3');
const sqlite3 = require('sqlite3').verbose();

let mainWindow;
let db;

app.disableHardwareAcceleration(); /// fixing gpu state invalid error

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile('logPage/logPage.html');

    // Define path to SQLite database file
    // const dbPath = path.join('C:', 'Users', 'dariu', 'Desktop', 'New folder', 'my-app', 'dataBase', 'data.db');
    const dbPath = path.join('E:', 'projects', 'applications', 'Electron-Projects', 'Electron-Project', 'my-app', 'dataBase', 'data.db');

    // Open SQLite database connection
    db = new sqlite3.Database(dbPath);

    // Create tables if not exists
    db.run('CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY, name TEXT, password TEXT, email TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY, name TEXT, description TEXT)');

    //db.run(`DROP TABLE IF EXISTS leaderboard`); 
    db.run(`
    CREATE TABLE IF NOT EXISTS leaderboard (
        id INTEGER PRIMARY KEY, 
        name TEXT, 
        score INTEGER,
        game_id INTEGER,
        user_id INTEGER,
        FOREIGN KEY(game_id) REFERENCES games(id)
        FOREIGN KEY(user_id) REFERENCES accounts(id)
    )
`);

    // Create admin account if not exists
    db.get('SELECT * FROM accounts WHERE name = ?', ['admin'], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (!row) {
            db.run('INSERT INTO accounts(id, name, password, email) VALUES(?, ?, ?, ?)', [1, 'admin', 'admin', 'admin@gmail.com']); 
        } else {
            mainWindow.webContents.send('admin-account-exists');
        }
    }),

    // Populate games table if not exists
    db.get('SELECT * FROM games WHERE name = ?', ['Tetris'] , (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (!row) {
            db.run('INSERT INTO games(id, name, description) VALUES(?, ?, ?)', [1, 'Snake', 'A classic snake game.']);
            db.run('INSERT INTO games(id, name, description) VALUES(?, ?, ?)', [2, 'Tetris', 'A classic tetris game.']);
        }
    }
    );


    mainWindow.on('closed', () => {
        mainWindow = null;
        // Close SQLite database connection when the window is closed
        db.close();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('create-account', (event, accountData) => {
    const { id, username, password, email } = accountData;
    db.run('INSERT INTO accounts(id, name, password, email) VALUES(?,?, ?, ?)', [id, username, password, email], function(err) {
        if (err) {
            mainWindow.webContents.send('create-account-response', { success: false, message: err.message });
        } else {
            mainWindow.webContents.send('create-account-response', { success: true });
        }
    });
});

ipcMain.on('print-all-data', (event) => {                          /// for the viewData
    db.all('SELECT * FROM accounts', (err, rows) => {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log(rows);
    });
});


///////////////////////////////////////////////////////////////////////////////////////////////////////

ipcMain.on('login', (event, loginData) => {
    const { username, password } = loginData;
    db.get('SELECT * FROM accounts WHERE name = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        if (row) {
            mainWindow.webContents.send('login-response', { success: true });
        } else {
            mainWindow.webContents.send('login-response', { success: false, message: 'Invalid username or password' });
        }
    }
    );
});

