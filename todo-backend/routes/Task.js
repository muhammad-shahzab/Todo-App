const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

// Get all todos for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.userId });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create todo
router.post('/', auth, async (req, res) => {
  const { title, start, end } = req.body;

  const todo = new Todo({
    user: req.user.userId,
    title,
    start,
    end
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update todo
router.put('/:id', auth, async (req, res) => {
  const { title, start, end, completed } = req.body;

  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, start, end, completed },
      { new: true }
    );

    if (!todo) return res.status(404).json({ message: 'Not found' });

    res.json(todo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const removed = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!removed) return res.status(404).json({ message: 'Not found' });

    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
