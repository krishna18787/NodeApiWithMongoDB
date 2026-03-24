const mongoose = require('mongoose');
const Task = require('../models/Task');

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function sendServerError(res, error) {
  res.status(500).json({ error: error.message });
}

async function createTask(req, res) {
  try {
    const { title, description, completed } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title is required' });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      completed,
    });

    res.status(201).json(task);
  } catch (error) {
    sendServerError(res, error);
  }
}

async function getTasks(req, res) {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    sendServerError(res, error);
  }
}

async function getTaskById(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'invalid task id' });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ error: 'task not found' });
    }

    res.json(task);
  } catch (error) {
    sendServerError(res, error);
  }
}

async function updateTask(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'invalid task id' });
    }

    const updates = {};

    if (typeof req.body.title === 'string') {
      if (!req.body.title.trim()) {
        return res.status(400).json({ error: 'title cannot be empty' });
      }

      updates.title = req.body.title.trim();
    }

    if (typeof req.body.description === 'string') {
      updates.description = req.body.description;
    }

    if (typeof req.body.completed === 'boolean') {
      updates.completed = req.body.completed;
    }

    const task = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ error: 'task not found' });
    }

    res.json(task);
  } catch (error) {
    sendServerError(res, error);
  }
}

async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'invalid task id' });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ error: 'task not found' });
    }

    res.json({ message: 'task deleted' });
  } catch (error) {
    sendServerError(res, error);
  }
}

module.exports = {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
};
