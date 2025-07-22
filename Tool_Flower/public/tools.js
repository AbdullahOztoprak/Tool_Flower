let tools = [];

function addTool(name, code) {
    tools.push({ name, code });
    renderTools();
}

function renderTools() {
    const list = document.getElementById('toolList');
    list.innerHTML = '';
    tools.forEach((tool, idx) => {
        const item = document.createElement('div');
        item.className = 'tool-item';
        item.innerHTML = `<strong>${tool.name}</strong><br><button onclick="runTool(${idx})">Run Tool</button>`;
        list.appendChild(item);
    });
}

function runTool(idx) {
    try {
        // eslint-disable-next-line no-eval
        eval(tools[idx].code);
    } catch (e) {
        alert('Error running tool: ' + e.message);
    }
}

window.addEventListener('DOMContentLoaded', renderTools);
