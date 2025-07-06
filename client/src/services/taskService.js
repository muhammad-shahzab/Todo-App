const TASKS_KEY = "task-manager-tasks"
const CATEGORIES_KEY = "task-manager-categories"

const defaultCategories = [
  { name: "Home", color: "bg-red-500" },
  { name: "School", color: "bg-orange-500" },
  { name: "Shopping list", color: "bg-blue-500" },
  { name: "Work", color: "bg-green-500" },
  { name: "Personal", color: "bg-purple-500" },
]

export const taskService = {
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

  getTasks: () => {
    const tasks = getStoredTasks()
    return tasks.map((task) => ({
      ...task,
      createdAt: new Date(task.createdAt),
    }))
  },

  getCategories: () => {
    return getStoredCategories()
  },

  addTask: (title, categoryId) => {
    const categories = getStoredCategories()
    const category = categories.find((cat) => cat.id === categoryId)

    if (!category) {
      throw new Error("Category not found")
    }

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
  },

  toggleTask: (taskId) => {
    const tasks = getStoredTasks()
    const taskIndex = tasks.findIndex((task) => task.id === taskId)

    if (taskIndex === -1) {
      throw new Error("Task not found")
    }

    tasks[taskIndex].completed = !tasks[taskIndex].completed
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))

    return {
      ...tasks[taskIndex],
      createdAt: new Date(tasks[taskIndex].createdAt),
    }
  },

  deleteTask: (taskId) => {
    const tasks = getStoredTasks()
    const taskIndex = tasks.findIndex((task) => task.id === taskId)

    if (taskIndex === -1) {
      throw new Error("Task not found")
    }

    tasks.splice(taskIndex, 1)
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
    return { success: true }
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
