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

  // Initialize data on mount
  useEffect(() => {
    taskService.initializeData()
    loadData()
  }, [])

  const loadData = () => {
    const allTasks = taskService.getTasks()
    const allCategories = taskService.getCategories()
    setTasks(allTasks)
    setCategories(allCategories)
  }

  const handleToggleTask = (taskId) => {
    try {
      taskService.toggleTask(taskId)
      loadData()
    } catch (error) {
      console.error("Error toggling task:", error)
    }
  }

  const handleDeleteTask = (taskId) => {
    try {
      taskService.deleteTask(taskId)
      loadData()
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const handleAddTask = (title, categoryId) => {
    try {
      taskService.addTask(title, categoryId)
      loadData()
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  const handleAddCategory = (name, color) => {
    try {
      taskService.addCategory(name, color)
      loadData()
    } catch (error) {
      console.error("Error adding category:", error)
    }
  }

  const handleDeleteCategory = (categoryId) => {
    try {
      taskService.deleteCategory(categoryId)
      loadData()
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
