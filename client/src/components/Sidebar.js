// "use client"

import { useState } from "react"
import Button from "./ui/Button"

// SVG Icons as components
const CheckSquareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const FolderOpenIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
    />
  </svg>
)

export default function Sidebar({ currentView, onViewChange, categories, categoryFilter, onCategoryFilter }) {
  const [categoriesExpanded, setCategoriesExpanded] = useState(true)

  return (
    <div className="w-64 bg-white border-r border flex flex-col">
      {/* Logo/Header */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-purple rounded-lg flex items-center justify-center">
            <CheckSquareIcon />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Task Manager</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => {
              onViewChange("tasks")
              onCategoryFilter(null)
            }}
            className={`w-full justify-start gap-3 ${
              currentView === "tasks" && !categoryFilter
                ? "bg-purple-100 text-purple-700 hover:bg-purple-100"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <CheckSquareIcon />
            All Tasks
          </Button>

          <div>
            <Button
              variant="ghost"
              onClick={() => setCategoriesExpanded(!categoriesExpanded)}
              className="w-full justify-between text-gray-600 hover:text-gray-900"
            >
              <div className="flex items-center gap-3">
                <FolderOpenIcon />
                Categories
              </div>
              {categoriesExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </Button>

            {categoriesExpanded && (
              <div className="ml-8 mt-2 space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      onViewChange("tasks")
                      onCategoryFilter(categoryFilter === category.id ? null : category.id)
                    }}
                    className={`w-full flex items-center gap-2 py-2 px-2 text-sm rounded-md transition-colors cursor-pointer border-none bg-transparent ${
                      categoryFilter === category.id
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <span className="truncate">{category.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            onClick={() => onViewChange("settings")}
            className={`w-full justify-start gap-3 ${
              currentView === "settings"
                ? "bg-purple-100 text-purple-700 hover:bg-purple-100"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <SettingsIcon />
            Settings
          </Button>
        </div>
      </nav>
    </div>
  )
}
