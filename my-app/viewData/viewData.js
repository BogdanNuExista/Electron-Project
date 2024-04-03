const { ipcRenderer } = require('electron');

// Request data from the main process
ipcRenderer.send('print-all-data');

// Listen for response from the main process
ipcRenderer.on('data-response', (event, data) => {
    const dataList = document.getElementById('data-list');
    // Clear previous data
    dataList.innerHTML = '';

    // Populate the list with data
    data.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `ID: ${item.id}, Username: ${item.name}, Email: ${item.email}`;
        dataList.appendChild(li);
    });
});

// Handle button click to print data to console
document.getElementById('print-data-btn').addEventListener('click', () => {
    ipcRenderer.send('print-all-data');
});
