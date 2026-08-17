const express = require('express');
const { nanoid } = require('nanoid');
const router = express.Router();
const fs = require('fs/promises');
const path = require('path');
const DATA_PATH = path.join(__dirname, '../data/tasks.json');

let tasks = [
  {
      id: nanoid(),
      title: 'Buy groceries',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: nanoid(),
      title: 'Finish TaskForge API',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: nanoid(),
      // no title — this is the deliberately broken task for Stage 2
      completed: false,
      createdAt: new Date().toISOString(),
    },
];

async function readTasks() {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

async function loadTasks() {
  tasks = await readTasks(DATA_PATH, JSON.stringify(tasks, null, 2));
}

function simulateCheck(task) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!task.title)
        reject(new Error('Task is missing required field: title'));
      else
        resolve({ verified: true, taskId: task.id });
    }, 1500);
  });
}

router.get('/', (req, res) => {
    res.json(tasks);});

router.get('/:id', (req, res) => {
    const task = tasks.find(t => t.id === req.params.id);
    if (!task)
        res.status(404).json({ message: 'Task not found' });
    else
        res.json(task);
});

router.get(`/:id/verify`, async (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  try {
    const result = await simulateCheck(task);
    res.json(result);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  const { title } = req.body;
  const newTask = {
    id: nanoid(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  }
  tasks.push(newTask);
  res.status(201).json(newTask);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const task = tasks.find(t => t.id === id);
  if (!task)
    res.status(404).json({ message: 'Task not found' });
  else {
    task.title = title;
    task.completed = completed;
    res.json(task);
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1)
    res.status(404).json({ message: 'Task not found' });
  else {
    tasks.splice(taskIndex, 1);
    res.status(204).send();
  }
});