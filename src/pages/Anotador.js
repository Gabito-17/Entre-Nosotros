import React, { useState } from "react";

function Anotador() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // Agrega una nueva tarea a la lista
  const handleAddTask = () => {
    if (task.trim() !== "") {
      setTasks([...tasks, { text: task, completed: false }]);
      setTask(""); // Limpia el campo de entrada
    }
  };

  // Marca una tarea como completada o la desmarca
  const handleToggleTask = (index) => {
    const newTasks = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(newTasks);
  };

  // Elimina una tarea de la lista
  const handleDeleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  return (
    <div>
      <h1>Anotador de Tareas</h1>
      <div>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Agregar una nueva tarea..."
        />
        <button onClick={handleAddTask}>Agregar</button>
      </div>
      <ul>
        {tasks.map((t, index) => (
          <li key={index}>
            <span
              onClick={() => handleToggleTask(index)}
              style={{ textDecoration: t.completed ? "line-through" : "none" }}
            >
              {t.text}
            </span>
            <button onClick={() => handleDeleteTask(index)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Anotador;
