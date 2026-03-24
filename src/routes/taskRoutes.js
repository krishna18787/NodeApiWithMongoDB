const express = require('express');
const {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} = require('../controllers/taskController');

const router = express.Router();

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
