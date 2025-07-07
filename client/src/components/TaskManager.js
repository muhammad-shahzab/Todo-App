"use client"

import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import TaskList from "./TaskList"
import Settings from "./Settings"
import { taskService } from "../services/taskService"

export default function TaskManager() {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [filter, setFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [currentView, setCurrentView] = useState("tasks")
  const [loading, setLoading] = useState(false)

  // Initialize data on mount
  useEffect(() => {
    const initializeApp = async () => {
      taskService.initializeData()
      await loadData()
    }
    initializeApp()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const allTasks = await taskService.getTasks()
      const allCategories = taskService.getCategories()
      setTasks(allTasks)
      setCategories(allCategories)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleTask = async (taskId) => {
    try {
      console.log("Toggling task in TaskManager:", taskId)
      const updatedTask = taskService.toggleTask(taskId)
      console.log("Task toggled, reloading data...")

      // Update the tasks state immediately for better UX
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
      )
    } catch (error) {
      console.error("Error toggling task:", error)
      // Reload data if there's an error
      await loadData()
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      setLoading(true)
      await taskService.deleteTask(taskId)
      await loadData() // Reload data after delete
    } catch (error) {
      console.error("Error deleting task:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (title, categoryId) => {
    try {
      setLoading(true)
      await taskService.addTask(title, categoryId)
      await loadData() // Reload data after add
    } catch (error) {
      console.error("Error adding task:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async (name, color) => {
    try {
      taskService.addCategory(name, color)
      await loadData()
    } catch (error) {
      console.error("Error adding category:", error)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    try {
      taskService.deleteCategory(categoryId)
      await loadData()
      if (categoryFilter === categoryId) {
        setCategoryFilter(null)
      }
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  const filteredTasks = tasks.filter((task) => {
    // Filter by completion status
    let statusMatch = true
    if (filter === "done") statusMatch = task.completed
    if (filter === "not-done") statusMatch = !task.completed

    // Filter by category
    let categoryMatch = true
    if (categoryFilter) {
      const category = categories.find((cat) => cat.id === categoryFilter)
      if (category) {
        categoryMatch = task.category.name === category.name
      }
    }

    return statusMatch && categoryMatch
  })

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        categories={categories}
        categoryFilter={categoryFilter}
        onCategoryFilter={setCategoryFilter}
      />
      {currentView === "tasks" ? (
        <TaskList
          tasks={filteredTasks}
          filter={filter}
          categoryFilter={categoryFilter}
          onFilterChange={setFilter}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onAddTask={handleAddTask}
          categories={categories}
        />
      ) : (
        <Settings categories={categories} onAddCategory={handleAddCategory} onDeleteCategory={handleDeleteCategory} />
      )}
    </div>
  )
}
