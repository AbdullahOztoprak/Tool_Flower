# Tool Flower

Tool Flower is a simple web platform to create, manage, and run your own scripts/tools—locally or on remote servers via SSH. Perfect for automating tasks and sharing useful scripts with a clean, modern UI.

## Quick Start

1. **Clone & Install**

   ```powershell
   git clone https://github.com/AbdullahOztoprak/Tool_Flower.git

   cd Tool_Flower/server
   npm install
   ```

2. **Start Backend**

   ```powershell
   cd Tool_Flower/server
   node server.js
   ```

3. **Start Frontend**

   ```powershell
   cd Tool_Flower/Tool_Flower/puplic
   npx live-server ../Tool_Flower/public --port=5500
   ```

4. **Open in Browser**
   - The browser should open automatically. If not, open [http://127.0.0.1:5500](http://127.0.0.1:5500) manually.

## Features

- Add, edit, delete, and run scripts
- Run scripts locally or via SSH
- Explore and search tools
- Simple user profile

## Notes

- SSH: Add your public key to the remote server for SSH features.
- If you see a `favicon.ico` 404, add a favicon or ignore it.
- Backend runs on port 3000 by default.

## How to Generate and Use SSH Keys (Short Version)

1. Open a terminal (or PowerShell on Windows).
2. Run:
   ```sh
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```
   (Just press Enter for the default location. Set a passphrase if you want.)
3. Your public key is at:
   - `~/.ssh/id_rsa.pub` (Linux/Mac/VM)
   - `%USERPROFILE%\.ssh\id_rsa.pub` (Windows)
4. Open and copy all text from `id_rsa.pub`.
   - On Windows, you can use:
     ```powershell
     notepad id_rsa.pub
     ```
5. Paste your public key into the "Your SSH Public Key" field above.
6. On your VM/server, run:
   ```sh
   cd ~/.ssh/
   nano authorized_keys
   ```
   (Paste your PC's public key here and save. For this, you need to generate a key on your VM too. You can simply type `ssh-keygen` and follow the prompts.)
7. Never share your private key (`id_rsa`). Only share your public key (`id_rsa.pub`).
8. To save and exit nano: Ctrl+O (write), Enter (confirm), Ctrl+X (exit).

---

MIT License