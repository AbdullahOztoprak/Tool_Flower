
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

// Run a tool by index
app.post('/api/run', (req, res) => {
    const { idx } = req.body;
    if (typeof idx !== 'number' || !tools[idx]) return res.status(400).json({ error: 'Invalid tool index' });
    exec(tools[idx].command, (error, stdout, stderr) => {
        if (error) return res.json({ error: stderr });
        res.json({ output: stdout });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
