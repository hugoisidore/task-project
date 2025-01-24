import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Fonction pour récupérer les tâches depuis l'API
  useEffect(() => {
    fetch('http://localhost:8080/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

  // Fonction pour ajouter une tâche
  const addTask = () => {
    if (newTask.trim() !== '') {
      fetch('http://localhost:8080/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTask, completed: false }),
      })
        .then((response) => response.json())
        .then((addedTask) => {
          setTasks([...tasks, addedTask]);
          setNewTask('');
        })
        .catch((error) => console.error('Error adding task:', error));
    }
  };

  // Fonction pour supprimer une tâche
  const deleteTask = (taskId) => {
    fetch(`http://localhost:8080/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== taskId));
      })
      .catch((error) => console.error('Error deleting task:', error));
  };

  return (
    <div className="App">
      <h1>Gestion des Tâches</h1>

      {/* Formulaire pour ajouter une tâche */}
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Ajouter une nouvelle tâche"
        />
        <button onClick={addTask}>Ajouter</button>
      </div>

      {/* Liste des tâches */}
      <div>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.text}{' '}
              <button onClick={() => deleteTask(task.id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;