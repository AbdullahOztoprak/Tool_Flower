const { exec } = require('child_process');
const os = require('os');
const path = require('path');

// Test SSH connection directly
const privateKeyPath = path.join(os.homedir(), '.ssh', 'id_rsa');
const sshCommand = `ssh -i "${privateKeyPath}" -p 2222 -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no abdullah257@127.0.0.1 "uptime"`;

console.log('Testing SSH command:', sshCommand);
console.log('Private key path:', privateKeyPath);
console.log('Home directory:', os.homedir());

exec(sshCommand, (error, stdout, stderr) => {
    console.log('\n=== SSH Test Results ===');
    console.log('Error:', error);
    console.log('Stdout:', stdout);
    console.log('Stderr:', stderr);
    
    if (error) {
        console.log('\nError details:');
        console.log('- Code:', error.code);
        console.log('- Signal:', error.signal);
        console.log('- Killed:', error.killed);
        console.log('- Command:', error.cmd);
    }
});
