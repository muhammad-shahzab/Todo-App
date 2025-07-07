const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"],
    credentials: true,
  }),
)
app.use(express.json())

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  console.log("Request body:", req.body)
  next()
})

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
  console.log("Connected to MongoDB")
})

// Simple Task Schema - only stores task name
const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Task = mongoose.model("Task", taskSchema)

// Test endpoint
app.get("/api/test", (req, res) => {
  console.log("Test endpoint hit!")
  res.json({ message: "Backend is working!", timestamp: new Date() })
})

// Get all task names
app.get("/api/tasks", async (req, res) => {
  try {
    console.log("Getting all tasks...")
    const tasks = await Task.find().sort({ createdAt: -1 })
    console.log(`Found ${tasks.length} tasks:`, tasks)
    res.json(tasks)
  } catch (error) {
    console.error("Error getting tasks:", error)
    res.status(500).json({ error: error.message })
  }
})

// Add a new task name
app.post("/api/tasks", async (req, res) => {
  try {
    console.log("Adding new task with data:", req.body)
    const { name } = req.body

    if (!name || name.trim() === "") {
      console.log("Task name is missing or empty")
      return res.status(400).json({ error: "Task name is required" })
    }

    const newTask = new Task({
      name: name.trim(),
    })

    console.log("Saving task to database...")
    const savedTask = await newTask.save()
    console.log("Task saved successfully:", savedTask)
    res.status(201).json(savedTask)
  } catch (error) {
    console.error("Error adding task:", error)
    res.status(400).json({ error: error.message })
  }
})

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    console.log("Deleting task with ID:", req.params.id)
    const { id } = req.params
    const deletedTask = await Task.findByIdAndDelete(id)

    if (!deletedTask) {
      console.log("Task not found")
      return res.status(404).json({ error: "Task not found" })
    }

    console.log("Task deleted successfully:", deletedTask)
    res.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Error deleting task:", error)
    res.status(400).json({ error: error.message })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Test the API at: http://localhost:${PORT}/api/test`)
})
