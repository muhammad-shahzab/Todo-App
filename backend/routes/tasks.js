const express = require("express")
const Task = require("../models/Task")
const router = express.Router()

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const { completed, category, limit = 50, page = 1 } = req.query

    // Build filter object
    const filter = {}
    if (completed !== undefined) {
      filter.completed = completed === "true"
    }
    if (category) {
      filter["category.name"] = new RegExp(category, "i")
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    const tasks = await Task.find(filter).sort({ createdAt: -1 }).limit(Number.parseInt(limit)).skip(skip)

    const total = await Task.countDocuments(filter)

    res.json({
      tasks,
      pagination: {
        current: Number.parseInt(page),
        total: Math.ceil(total / limit),
        count: tasks.length,
        totalTasks: total,
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single task
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    res.json(task)
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid task ID format" })
    }
    res.status(500).json({ error: error.message })
  }
})

// Create new task
router.post("/", async (req, res) => {
  try {
    const { title, category } = req.body

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Task title is required" })
    }

    const newTask = new Task({
      title: title.trim(),
      category: category || { name: "Personal", color: "bg-blue-500" },
    })

    const savedTask = await newTask.save()
    res.status(201).json(savedTask)
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ error: errors.join(", ") })
    }
    res.status(400).json({ error: error.message })
  }
})

// Update task
router.put("/:id", async (req, res) => {
  try {
    const { title, completed, category } = req.body

    const updateData = {}
    if (title !== undefined) updateData.title = title.trim()
    if (completed !== undefined) updateData.completed = completed
    if (category !== undefined) updateData.category = category

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" })
    }

    res.json(updatedTask)
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid task ID format" })
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ error: errors.join(", ") })
    }
    res.status(400).json({ error: error.message })
  }
})

// Toggle task completion
router.patch("/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    task.completed = !task.completed
    const updatedTask = await task.save()

    res.json(updatedTask)
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid task ID format" })
    }
    res.status(400).json({ error: error.message })
  }
})

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id)

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" })
    }

    res.json({
      message: "Task deleted successfully",
      task: deletedTask,
    })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid task ID format" })
    }
    res.status(400).json({ error: error.message })
  }
})

// Bulk delete tasks
router.delete("/", async (req, res) => {
  try {
    const { ids, completed } = req.body

    const filter = {}

    if (ids && Array.isArray(ids)) {
      filter._id = { $in: ids }
    } else if (completed !== undefined) {
      filter.completed = completed
    } else {
      return res.status(400).json({ error: "Provide either task IDs or completion status" })
    }

    const result = await Task.deleteMany(filter)

    res.json({
      message: `${result.deletedCount} task(s) deleted successfully`,
      deletedCount: result.deletedCount,
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router
