const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

let mainWindow;
let db;

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

    //mainWindow.loadFile('viewData/viewData.html');

    // Define path to SQLite database file
    const dbPath = path.join('E:', 'projects', 'applications', 'Electron-Projects', 'Electron-Project', 'my-app', 'dataBase', 'data.db');

    // Open SQLite database connection
    db = new sqlite3.Database(dbPath);

    // Create accounts table if not exists
    db.run('CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY, name TEXT, password TEXT, email TEXT)');

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