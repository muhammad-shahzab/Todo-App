"use client"

import Button from "./ui/Button"

// SVG Icons
const Edit2Icon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

const Trash2Icon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
)

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div className="group bg-white rounded-lg border border p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${
            task.completed ? "bg-purple-600 border-purple-600" : "border-gray-300 hover:border-purple-400"
          }`}
        >
          {task.completed && <CheckIcon />}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className={`text-gray-900 ${task.completed ? "line-through text-gray-400" : ""}`}>{task.title}</div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium text-white px-2 py-1 rounded-full ${task.category.color}`}
            >
              <div className="w-2 h-2 bg-white rounded-full opacity-80" />
              {task.category.name}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
            <Edit2Icon />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 w-8 p-0 text-gray-400 hover:text-red-600">
            <Trash2Icon />
          </Button>
        </div>
      </div>
    </div>
  )
}
