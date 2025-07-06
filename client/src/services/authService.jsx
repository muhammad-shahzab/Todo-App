const USERS_KEY = "task-manager-users"
const SESSION_KEY = "task-manager-session"

export const authService = {
  register: async (email, password, name) => {
    const users = getStoredUsers()

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return { success: false, message: "User already exists with this email" }
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In production, hash this password
      name,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))

    return {
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: new Date(newUser.createdAt),
      },
    }
  },

  login: async (email, password) => {
    const users = getStoredUsers()
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return { success: false, message: "Invalid email or password" }
    }

    // Create session
    const sessionId = Date.now().toString() + Math.random().toString(36)
    localStorage.setItem(SESSION_KEY, JSON.stringify({ sessionId, userId: user.id }))

    return {
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: new Date(user.createdAt),
      },
      sessionId,
    }
  },

  verifySession: async () => {
    const sessionData = localStorage.getItem(SESSION_KEY)
    if (!sessionData) {
      return { valid: false }
    }

    try {
      const { userId } = JSON.parse(sessionData)
      const users = getStoredUsers()
      const user = users.find((u) => u.id === userId)

      if (!user) {
        return { valid: false }
      }

      return {
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: new Date(user.createdAt),
        },
      }
    } catch {
      return { valid: false }
    }
  },

  logout: async () => {
    localStorage.removeItem(SESSION_KEY)
    return { success: true }
  },
}

function getStoredUsers() {
  const stored = localStorage.getItem(USERS_KEY)
  return stored ? JSON.parse(stored) : []
}
