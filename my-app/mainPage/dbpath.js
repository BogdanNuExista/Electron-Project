function getDbPath() {
    // const dbPath = path.join('C:', 'Users', 'dariu', 'Desktop', 'New folder', 'my-app', 'dataBase', 'data.db');
    const dbPath = path.join('E:', 'projects', 'applications', 'Electron-Projects', 'Electron-Project', 'my-app', 'dataBase', 'data.db');
    return dbPath;
}

module.exports = getDbPath;