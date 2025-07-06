"use client"

import { useState } from "react"
import Button from "./ui/Button"
import Input from "./ui/Input"
import TaskItem from "./TaskItem"

// SVG Icons
const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
    />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

export default function TaskList({
  tasks,
  filter,
  categoryFilter,
  onFilterChange,
  onToggleTask,
  onDeleteTask,
  onAddTask,
  categories,
}) {
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || "")
  const [showAddTask, setShowAddTask] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim(), selectedCategoryId)
      setNewTaskTitle("")
      setShowAddTask(false)
      setShowCategoryDropdown(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTask()
    }
    if (e.key === "Escape") {
      setShowAddTask(false)
      setNewTaskTitle("")
      setShowCategoryDropdown(false)
    }
  }

  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId) || categories[0]

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          {categoryFilter
            ? `${categories.find((cat) => cat.id === categoryFilter)?.name || "Category"} tasks`
            : "All your tasks"}
        </h1>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-lg font-medium text-gray-700 mr-4">Tasks</span>
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange("all")}
              className={
                filter === "all" ? "bg-gray-900 text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900"
              }
            >
              All
            </Button>
            <Button
              variant={filter === "done" ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange("done")}
              className={
                filter === "done" ? "bg-gray-900 text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900"
              }
            >
              Done
            </Button>
            <Button
              variant={filter === "not-done" ? "default" : "ghost"}
              size="sm"
              onClick={() => onFilterChange("not-done")}
              className={
                filter === "not-done" ? "bg-gray-900 text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900"
              }
            >
              Not done
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <FilterIcon />
          </Button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 p-8 space-y-4">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onToggleTask(task.id)}
            onDelete={() => onDeleteTask(task.id)}
          />
        ))}

        {/* Add Task */}
        <div className="bg-white rounded-lg border border p-4">
          {showAddTask ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0" />
                <Input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter task title..."
                  className="border-none shadow-none p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 bg-transparent"
                  autoFocus
                />
              </div>

              {/* Category Selection */}
              <div className="ml-9 relative">
                <Button
                  variant="outline"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center gap-2 text-sm"
                  size="sm"
                >
                  <div className={`w-3 h-3 rounded-full ${selectedCategory?.color}`} />
                  {selectedCategory?.name}
                  <ChevronDownIcon />
                </Button>

                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border rounded-md shadow-lg z-10 min-w-150">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategoryId(category.id)
                          setShowCategoryDropdown(false)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md cursor-pointer border-none bg-transparent"
                      >
                        <div className={`w-3 h-3 rounded-full ${category.color}`} />
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setShowAddTask(true)}
              className="w-full justify-start gap-3 text-gray-400 hover:text-gray-600 p-0 h-auto"
            >
              <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                <PlusIcon />
              </div>
              Add a task
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
