const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All task routes are protected
router.use(authMiddleware);

// GET /api/tasks — list all tasks for logged-in user
router.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// POST /api/tasks — create a new task
router.post("/", async (req, res, next) => {
  try {
    const { title, description, stage } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      stage: stage || "Todo",
      owner: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// PUT /api/tasks/:id — update a task
router.put("/:id", async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { title, description, stage } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      task.title = title.trim();
    }
    if (description !== undefined) task.description = description.trim();
    if (stage !== undefined) task.stage = stage;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/tasks/:id — delete a task
router.delete("/:id", async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
