const fs = require('fs/promises');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'task.json');

async function readTasks() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function writeTasks(tasks) {
  await fs.writeFile(DATA_PATH, JSON.stringify(tasks, null, 2));
}

module.exports = { readTasks, writeTasks };