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
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
      <h1 className="text-2xl font-bold text-center mb-4">
        Anotador de Tareas
      </h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="flex-grow p-2 border rounded-l-md"
          placeholder="Agregar una nueva tarea..."
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white p-2 rounded-r-md"
        >
          Agregar
        </button>
      </div>
      <ul>
        {tasks.map((t, index) => (
          <li
            key={index}
            className={`flex justify-between items-center p-2 border-b ${
              t.completed ? "line-through text-gray-500" : ""
            }`}
          >
            <span
              onClick={() => handleToggleTask(index)}
              className="cursor-pointer flex-grow"
            >
              {t.text}
            </span>
            <button
              onClick={() => handleDeleteTask(index)}
              className="bg-red-500 text-white p-1 rounded"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Anotador;
