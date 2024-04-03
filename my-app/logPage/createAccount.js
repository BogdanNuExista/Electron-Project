const { ipcRenderer } = require('electron');

ipcRenderer.on('create-account-response', (event, response) => {
    if (response.success) {
        alert('Account created successfully!');
        // Navigate to the login page
        window.location.href = 'logPage.html';
    } else {
        alert('Error: ' + response.message);
    }
});

document.getElementById('create-account-btn').addEventListener('click', () => {

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let email = document.getElementById('email').value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Regular expression to check if the name contains only letters, digits, and underscores
    const nameRegex = /^[a-zA-Z0-9_]+$/;

    if (!emailRegex.test(email)) {
        alert('Please enter a valid Gmail address!');
        return;
    }
    // Check if the name contains only letters, digits, and underscores
    if (!nameRegex.test(username)) {
        alert('Username should only contain letters, digits, and underscores!');
        return;
    }

    var id = Math.floor(Math.random() * 1000);

    ipcRenderer.send('create-account', { id, username, password, email });
});

document.getElementById('go-back-btn').addEventListener('click', () => {
    // Navigate to the login page
    window.location.href = 'logPage.html';
});
