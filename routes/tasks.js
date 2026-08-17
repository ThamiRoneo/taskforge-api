const express = require('express');
const { nanoid } = require('nanoid');
const router = express.Router();

let tasks = [];

router.get('/', (req, res) => {
    res.json(tasks);});

router.get('/:id', (req, res) => {
    const task = tasks.find(t => t.id === req.params.id);
    if (!task)
        res.status(404).json({ message: 'Task not found' });
    else
        res.json(task);
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