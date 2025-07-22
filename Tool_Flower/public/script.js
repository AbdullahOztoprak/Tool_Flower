document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');

    // Multiple demo users
    let users = [
        { name: 'flower', pass: 'petal123' },
        { name: 'admin', pass: 'admin' },
        { name: 'user', pass: 'user' },
        { name: 'user123', pass: 'user123' }
    ];
    // Add registered users from localStorage
    try {
        const localUsers = JSON.parse(localStorage.getItem('toolFlowerUsers') || '[]');
        users = users.concat(localUsers);
    } catch {}
    const found = users.find(u => u.name === username && u.pass === password);
    if (found) {
        window.location.href = 'homepage.html';
    } else {
        errorDiv.textContent = 'Invalid username or password!';
    }
});
