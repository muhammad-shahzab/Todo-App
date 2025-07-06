import TaskManager from "./components/TaskManager"
import { ThemeProvider } from "./contexts/ThemeContext"
import "./App.css"

function App() {
  return (
    <ThemeProvider>
      <TaskManager />
    </ThemeProvider>
  )
}

export default App
