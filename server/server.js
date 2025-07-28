const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const os = require('os');
const path = require('path');
const app = express();
const PORT = 3000;

let tools = []; // Store tools in memory for now

app.use(cors());
app.use(express.json());

// Test SSH connection
app.post('/api/ssh-test', (req, res) => {
    const { sshUser, sshHost } = req.body;
    if (!sshUser || !sshHost) return res.status(400).json({ error: 'Missing SSH username or host' });
    // Dynamically get the user's home directory for the private key path
    const privateKeyPath = path.join(os.homedir(), '.ssh', 'id_rsa');
    // Use 127.0.0.1 instead of localhost and add more debugging
    const sshHostFixed = (sshHost === 'localhost') ? '127.0.0.1' : sshHost;
    const sshCommand = `ssh -i "${privateKeyPath}" -p 2222 -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no ${sshUser}@${sshHostFixed} "uptime"`;
    console.log('SSH Test Command:', sshCommand);
    exec(sshCommand, (error, stdout, stderr) => {
        console.log('SSH Test - Error:', error);
        console.log('SSH Test - Stdout:', stdout);
        console.log('SSH Test - Stderr:', stderr);
        if (error) return res.json({ error: stderr || error.message });
        res.json({ output: stdout.trim() });
    });
});

// Add a new tool
app.post('/api/tools', (req, res) => {
    const { name, command } = req.body;
    if (!name || !command) return res.status(400).json({ error: 'Name and command required' });
    tools.push({ name, command });
    res.json({ success: true });
});

// List all tools
app.get('/api/tools', (req, res) => {
    res.json(tools);
});

// Run a tool by command (sent from frontend)
app.post('/api/run', (req, res) => {
    const { command, sshUser, sshHost, sshPath } = req.body;
    if (!command) return res.status(400).json({ error: 'No command provided' });

    // If SSH details provided, run on remote server
    if (sshUser && sshHost && sshPath) {
        const privateKeyPath = path.join(os.homedir(), '.ssh', 'id_rsa');
        // Use 127.0.0.1 instead of localhost if user enters localhost
        const sshHostFixed = (sshHost === 'localhost') ? '127.0.0.1' : sshHost;
        const sshCommand = `ssh -i "${privateKeyPath}" -p 2222 -o BatchMode=yes -o ConnectTimeout=10 -o StrictHostKeyChecking=no ${sshUser}@${sshHostFixed} "cd ${sshPath} && ${command}"`;
        console.log('Executing SSH command:', sshCommand);
        console.log('Private key path:', privateKeyPath);
        console.log('SSH host (fixed):', sshHostFixed);
        exec(sshCommand, { timeout: 120000 }, (error, stdout, stderr) => { // 2 minute timeout
            if (error) {
                console.log('SSH Error Details:', {
                    code: error.code,
                    signal: error.signal,
                    killed: error.killed,
                    cmd: error.cmd
                });
                console.log('SSH Error message:', error.message);
                console.log('SSH Stderr:', stderr);
                return res.json({ error: `SSH execution failed: ${stderr || error.message}` });
            }
            console.log('SSH Output:', stdout);
            res.json({ output: stdout });
        });
    } else {
        // Run locally if no SSH details
        console.log('Executing local command:', command);
        exec(command, { timeout: 120000 }, (error, stdout, stderr) => { // 2 minute timeout
            if (error) {
                console.log('Local Error:', stderr || error.message);
                return res.json({ error: `Local execution failed: ${stderr || error.message}` });
            }
            console.log('Local Output:', stdout);
            res.json({ output: stdout });
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
