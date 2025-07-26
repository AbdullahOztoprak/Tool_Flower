
const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();
const PORT = 3000;

let tools = []; // Store tools in memory for now

app.use(cors());
app.use(express.json());

// Test SSH connection
app.post('/api/ssh-test', (req, res) => {
    const { sshUser, sshHost } = req.body;
    if (!sshUser || !sshHost) return res.status(400).json({ error: 'Missing SSH username or host' });
    // Try a simple SSH command (uptime)
    exec(`ssh -i C:/Users/z0055r2k/.ssh/id_rsa -p 2222 -o BatchMode=yes -o ConnectTimeout=5 ${sshUser}@${sshHost} "uptime"`, (error, stdout, stderr) => {
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
        const sshCommand = `ssh -i C:/Users/z0055r2k/.ssh/id_rsa -p 2222 -o BatchMode=yes -o ConnectTimeout=10 ${sshUser}@${sshHost} "cd ${sshPath} && ${command}"`;
        console.log('Executing SSH command:', sshCommand);
        exec(sshCommand, { timeout: 120000 }, (error, stdout, stderr) => { // 2 minute timeout
            if (error) {
                console.log('SSH Error:', stderr || error.message);
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
