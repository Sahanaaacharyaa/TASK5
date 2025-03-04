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

  const formatTimeElapsed = (timestamp) => {
    const elapsed = Math.floor((Date.now() - timestamp) / 1000);
    const hours = String(Math.floor(elapsed / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
    const seconds = String(elapsed % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  return (
    <div className={`container ${tasks.length > 5 ? "bg-alt" : ""}`}>
      <h1>My Todo List</h1>
      <p>Completed: {completedTasks} | Pending: {pendingTasks}</p>
      
      <div className="input-section">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={addTask}>➕ Add Task</button>
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
              <span onClick={() => toggleComplete(index)}>
                {task.text} {task.completed ? " ✅" : ""}
              </span>
              
              <small>⏳ {formatTimeElapsed(task.timestamp)}</small>

              <div className="actions">
                {editingIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <button onClick={() => saveEdit(index)}>💾 Save</button>
                  </>
                ) : (
                  <button onClick={() => startEditing(index, task.text)}>Edit</button>
                )}
                <button onClick={() => deleteTask(index)}>Delete</button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default App;
