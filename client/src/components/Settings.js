"use client"

import { useState } from "react"
import Button from "./ui/Button"
import Input from "./ui/Input"
import Label from "./ui/Label"
import { useTheme } from "../contexts/ThemeContext"

// SVG Icons
const MoonIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
)

const SunIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
)

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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

const PaletteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z"
    />
  </svg>
)

const colorOptions = [
  { name: "Red", value: "bg-red-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Yellow", value: "bg-yellow-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Indigo", value: "bg-indigo-500" },
]

export default function Settings({ categories, onAddCategory, onDeleteCategory }) {
  const { theme, setTheme } = useTheme()
  const [newCategoryName, setNewCategoryName] = useState("")
  const [selectedColor, setSelectedColor] = useState("bg-blue-500")
  const [showAddCategory, setShowAddCategory] = useState(false)

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim(), selectedColor)
      setNewCategoryName("")
      setSelectedColor("bg-blue-500")
      setShowAddCategory(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border px-8 py-6">
        <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 space-y-8">
        {/* Theme Settings */}
        <div className="bg-white rounded-lg border border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Appearance</h2>
          <div className="space-y-4">
            <Label className="text-gray-700">Theme</Label>
            <div className="flex gap-3">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => setTheme("light")}
                className="flex items-center gap-2"
              >
                <SunIcon />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => setTheme("dark")}
                className="flex items-center gap-2"
              >
                <MoonIcon />
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                onClick={() => setTheme("system")}
                className="flex items-center gap-2"
              >
                <PaletteIcon />
                System
              </Button>
            </div>
          </div>
        </div>

        {/* Categories Management */}
        <div className="bg-white rounded-lg border border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
            <Button onClick={() => setShowAddCategory(true)} className="flex items-center gap-2" size="sm">
              <PlusIcon />
              Add Category
            </Button>
          </div>

          {/* Add Category Form */}
          {showAddCategory && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryName" className="text-gray-700">
                    Category Name
                  </Label>
                  <Input
                    id="categoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">Color</Label>
                  <div className="flex gap-2 mt-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-8 h-8 rounded-full ${color.value} border-2 cursor-pointer ${
                          selectedColor === color.value ? "border-gray-800" : "border-transparent"
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddCategory} size="sm">
                    Add Category
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddCategory(false)
                      setNewCategoryName("")
                      setSelectedColor("bg-blue-500")
                    }}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Categories List */}
          <div className="space-y-2"> 
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${category.color}`} />
                  <span className="text-gray-800">{category.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2Icon />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
