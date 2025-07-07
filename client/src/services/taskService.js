const TASKS_KEY = "task-manager-tasks"
const CATEGORIES_KEY = "task-manager-categories"
const API_BASE_URL = "http://localhost:5000/api"

const defaultCategories = [
  { name: "Home", color: "bg-red-500" },
  { name: "School", color: "bg-orange-500" },
  { name: "Shopping list", color: "bg-blue-500" },
  { name: "Work", color: "bg-green-500" },
  { name: "Personal", color: "bg-purple-500" },
]

export const taskService = {
  // Test API connection
  testConnection: async () => {
    try {
      console.log("Testing API connection...")
      const response = await fetch(`${API_BASE_URL}/test`)
      const data = await response.json()
      console.log("API test successful:", data)
      return data
    } catch (error) {
      console.error("API test failed:", error)
      throw error
    }
  },

  initializeData: () => {
    const categories = getStoredCategories()

    if (categories.length === 0) {
      // Create default categories
      const newCategories = defaultCategories.map((cat, index) => ({
        id: `category-${Date.now()}-${index}`,
        ...cat,
      }))
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(newCategories))
    }
  },

  getTasks: async () => {
    try {
      console.log("Fetching tasks from API...")
      const response = await fetch(`${API_BASE_URL}/tasks`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const dbTasks = await response.json()
      console.log("Tasks fetched from API:", dbTasks)

      // Get local task states (completion status, categories)
      const localTasks = getStoredTasks()

      // Convert DB tasks to your frontend format, merging with local state
      const convertedTasks = dbTasks.map((dbTask) => {
        // Find matching local task by checking if titles match
        const localTask = localTasks.find((local) => local.title === dbTask.name || local.id === dbTask._id)

        return {
          id: dbTask._id,
          title: dbTask.name,
          completed: localTask ? localTask.completed : false, // Use local completion status
          category: localTask ? localTask.category : { name: "Personal", color: "bg-purple-500" }, // Use local category
          createdAt: new Date(dbTask.createdAt),
        }
      })

      // Update localStorage with the merged data
      const tasksForStorage = convertedTasks.map((task) => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
      }))
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasksForStorage))

      console.log("Converted tasks:", convertedTasks)
      return convertedTasks
    } catch (error) {
      console.error("Error fetching tasks from API:", error)
      console.log("Falling back to localStorage...")
      // Fallback to localStorage if API fails
      const tasks = getStoredTasks()
      return tasks.map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }))
    }
  },

  getCategories: () => {
    return getStoredCategories()
  },

  addTask: async (title, categoryId) => {
    console.log("Adding task:", { title, categoryId })

    const categories = getStoredCategories()
    const category = categories.find((cat) => cat.id === categoryId)

    if (!category) {
      throw new Error("Category not found")
    }

    try {
      console.log("Sending task to API...")
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: title }),
      })

      console.log("API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API error response:", errorText)
        throw new Error(`Failed to add task: ${response.status}`)
      }

      const dbTask = await response.json()
      console.log("Task added to API:", dbTask)

      // Create the new task in frontend format
      const newTask = {
        id: dbTask._id,
        title: dbTask.name,
        completed: false,
        category: { name: category.name, color: category.color },
        createdAt: new Date(dbTask.createdAt),
      }

      // Also add to localStorage for completion status tracking
      const localTasks = getStoredTasks()
      localTasks.push({
        ...newTask,
        createdAt: newTask.createdAt.toISOString(),
      })
      localStorage.setItem(TASKS_KEY, JSON.stringify(localTasks))

      console.log("Returning formatted task:", newTask)
      return newTask
    } catch (error) {
      console.error("Error adding task to API:", error)
      console.log("Falling back to localStorage...")
      // Fallback to localStorage if API fails
      const tasks = getStoredTasks()
      const newTask = {
        id: `task-${Date.now()}-${Math.random()}`,
        title,
        completed: false,
        category: { name: category.name, color: category.color },
        createdAt: new Date().toISOString(),
      }

      tasks.push(newTask)
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))

      return {
        ...newTask,
        createdAt: new Date(newTask.createdAt),
      }
    }
  },

  toggleTask: (taskId) => {
    console.log("Toggling task:", taskId)

    const tasks = getStoredTasks()
    const taskIndex = tasks.findIndex((task) => task.id === taskId)

    if (taskIndex === -1) {
      console.error("Task not found in localStorage:", taskId)
      throw new Error("Task not found")
    }

    // Toggle the completion status
    tasks[taskIndex].completed = !tasks[taskIndex].completed
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))

    console.log("Task toggled:", tasks[taskIndex])

    return {
      ...tasks[taskIndex],
      createdAt: new Date(tasks[taskIndex].createdAt),
    }
  },

  deleteTask: async (taskId) => {
    try {
      console.log("Deleting task from API:", taskId)
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.status}`)
      }

      // Also remove from localStorage
      const tasks = getStoredTasks()
      const filteredTasks = tasks.filter((task) => task.id !== taskId)
      localStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks))

      console.log("Task deleted from API and localStorage successfully")
      return { success: true }
    } catch (error) {
      console.error("Error deleting task from API:", error)
      console.log("Falling back to localStorage...")
      // Fallback to localStorage if API fails
      const tasks = getStoredTasks()
      const taskIndex = tasks.findIndex((task) => task.id === taskId)

      if (taskIndex === -1) {
        throw new Error("Task not found")
      }

      tasks.splice(taskIndex, 1)
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
      return { success: true }
    }
  },

  addCategory: (name, color) => {
    const categories = getStoredCategories()
    const newCategory = {
      id: `category-${Date.now()}-${Math.random()}`,
      name,
      color,
    }

    categories.push(newCategory)
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))
    return newCategory
  },

  deleteCategory: (categoryId) => {
    const categories = getStoredCategories()
    const categoryIndex = categories.findIndex((cat) => cat.id === categoryId)

    if (categoryIndex === -1) {
      throw new Error("Category not found")
    }

    const categoryName = categories[categoryIndex].name
    categories.splice(categoryIndex, 1)
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories))

    // Move tasks from deleted category to first available category
    const remainingCategories = categories
    const defaultCategory = remainingCategories[0]

    if (defaultCategory) {
      const tasks = getStoredTasks()
      tasks.forEach((task) => {
        if (task.category.name === categoryName) {
          task.category = { name: defaultCategory.name, color: defaultCategory.color }
        }
      })
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
    }

    return { success: true }
  },
}

function getStoredTasks() {
  const stored = localStorage.getItem(TASKS_KEY)
  return stored ? JSON.parse(stored) : []
}

function getStoredCategories() {
  const stored = localStorage.getItem(CATEGORIES_KEY)
  return stored ? JSON.parse(stored) : []
}
