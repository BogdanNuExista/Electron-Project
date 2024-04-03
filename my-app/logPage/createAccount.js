const { ipcRenderer } = require('electron');

ipcRenderer.on('create-account-response', (event, response) => {
    if (response.success) {
        showAlert('Account created successfully!', () => {
            window.location.href = 'logPage.html';
        }
        );
        // Navigate to the login page
    } else {
        showAlert('Failed to create account: ' + response.message, () => {
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('email').value = '';
        });
    }
});

function showAlert(message, callback) {
    document.getElementById('alert-message').textContent = message;
    document.getElementById('alert-box').style.display = 'block';
    document.getElementById('alert-ok').onclick = function() {
        document.getElementById('alert-box').style.display = 'none';
        callback();
    };
}

document.getElementById('create-account-btn').addEventListener('click', () => {

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let email = document.getElementById('email').value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Regular expression to check if the name contains only letters, digits, and underscores
    const nameRegex = /^[a-zA-Z0-9_]+$/;

    if (!emailRegex.test(email)) {
        
        showAlert('Invalid email address!', () => {
            document.getElementById('email').value = '';
        });
        return;
    }
    // Check if the name contains only letters, digits, and underscores
    if (!nameRegex.test(username)) {
        
        showAlert('Username can only contain letters, digits, and underscores!', () => {
            document.getElementById('username').value = '';
        });
        return;
    }

    /// check if email already exists

    var id = Math.floor(Math.random() * 1000) + 2; /// to avoid the id of the admin (1)

    ipcRenderer.send('create-account', { id, username, password, email });
});

document.getElementById('go-back-btn').addEventListener('click', () => {
    // Navigate to the login page
    window.location.href = 'logPage.html';
});
