const express = require('express');
const { nanoid } = require('nanoid');
const { readTasks, writeTasks } = require('../data/taskStore');

const router = express.Router();

// --- Async helper for /verify (Stage 2) ---
function simulateCheck(task) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!task.title) {
        reject(new Error('Task is missing required field: title'));
      } else {
        resolve({ verified: true, taskId: task.id });
      }
    }, 1500);
  });
}

// --- GET /tasks — return all tasks ---
router.get('/', async (req, res) => {
  const tasks = await readTasks();
  res.json(tasks);
});

// --- GET /tasks/:id — return a single task ---
router.get('/:id', async (req, res) => {
  const tasks = await readTasks();
  const task = tasks.find(t => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

// --- GET /tasks/:id/verify — simulated async check (Stage 2) ---
router.get('/:id/verify', async (req, res) => {
  const tasks = await readTasks();
  const task = tasks.find(t => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  try {
    const result = await simulateCheck(task);
    res.json(result);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
});

// --- POST /tasks — create a new task ---
router.post('/', async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const tasks = await readTasks();

  const newTask = {
    id: nanoid(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  await writeTasks(tasks);

  res.status(201).json(newTask);
});

// --- PUT /tasks/:id — update a task ---
router.put('/:id', async (req, res) => {
  const tasks = await readTasks();
  const task = tasks.find(t => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  Object.assign(task, req.body);
  await writeTasks(tasks);

  res.json(task);
});

// --- DELETE /tasks/:id — remove a task ---
router.delete('/:id', async (req, res) => {
  const tasks = await readTasks();
  const index = tasks.findIndex(t => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(index, 1);
  await writeTasks(tasks);

  res.status(204).send();
});

module.exports = router;