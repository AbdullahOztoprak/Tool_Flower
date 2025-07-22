# Tool_Flower Backend API

## Setup

1. Install Node.js and npm on your server (Debian VM recommended).
2. Install dependencies:
   ```
   npm install express cors
   ```
3. Start the server:
   ```
   node server.js
   ```

## API Endpoints

- `POST /api/tools` — Add a new tool/script.  
  Body: `{ "name": "Tool Name", "command": "shell command" }`

- `GET /api/tools` — List all tools/scripts.

- `POST /api/run` — Run a tool by index.  
  Body: `{ "idx": 0 }`

## Notes

- Tools are stored in memory (not persistent).
- You can extend this to save/load tools from a file or database.
