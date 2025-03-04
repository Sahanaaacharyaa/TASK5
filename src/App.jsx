import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import addSound from "./sounds/complete.mp3";
import completeSound from "./sounds/complete.mp3";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [newTask, setNewTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [theme, setTheme] = useState("light");
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.play().catch((error) => console.error("Sound playback failed:", error));
  };

  const addTask = () => {
    if (newTask.trim() === "") return;
    playSound(addSound);
    setTasks([...tasks, { text: newTask, completed: false, timestamp: Date.now() }]);
    setNewTask("");
  };

  const toggleComplete = (index) => {
    playSound(completeSound);
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const startEditing = (index, text) => {
    setEditingIndex(index);
    setEditingText(text);
  };

  const saveEdit = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].text = editingText;
    setTasks(updatedTasks);
    setEditingIndex(null);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`container ${theme}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </button>
      <h1>My Todo List</h1>
      <p>Completed: {completedTasks} | Pending: {pendingTasks}</p>
      
      <div className="input-section">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      
      <ul>
        <AnimatePresence>
          {tasks.map((task, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className={task.completed ? "completed" : ""}
            >
              <div className="task-left">
                <div className="check-circle" onClick={() => toggleComplete(index)}>
                  {task.completed && "✔️"}
                </div>
                <span>{task.text}</span>
              </div>
              
              <div className="actions">
                {editingIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <button className="small-btn" onClick={() => saveEdit(index)}>Save</button>
                  </>
                ) : (
                  <button className="small-btn" onClick={() => startEditing(index, task.text)}>Edit</button>
                )}
                <button className="small-btn delete-btn" onClick={() => deleteTask(index)}>Delete</button>
              </div>
              
              {task.completed && <p className="appreciation">Great Job! Keep it up!</p>}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default App;
