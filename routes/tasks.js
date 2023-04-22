const express = require("express");
const router = express.Router();
const data = require("../data");
const tasksData = data.tasks;
module.exports = router;

router.get('/tasks', async (req, res) => {
    res.render("tasks.handlebers");
});

router.post('/tasks', async (req, res) => {

    const newTodo = req.body.todo;
  NewTask = tasksData.createTask(newTodo);
  res.json(NewTask);

});

router.delete('/tasks', async (req, res) => {

    const id = req.params.id;
  if (id >= 0 && id < todos.length) {
    todos.splice(id, 1);
    res.json(todos);
  } else {
    res.status(400).json({ error: 'Invalid todo ID' });
  }

});

module. export = router;