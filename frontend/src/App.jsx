import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null); 
  const [editTaskText, setEditTaskText] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [darkMode, setDarkMode] = useState(true);
 
  // Fonction pour récupérer les tâches depuis l'API
  useEffect(() => {
    // pour les tâches
    fetch('http://localhost:8080/tasks')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error));

    // pour les catégories
    fetch('http://localhost:8080/categories')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));
  }, []);

  // Fonction pour ajouter une tâche
  const addTask = () => {
    if (newTask.trim() !== '') {
      fetch('http://localhost:8080/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: newTask, 
          completed: false,
          category: selectedCategory ? { id: selectedCategory } : null,
          createdAt: new Date().toISOString()
        }),
      })
        .then((response) => response.json())
        .then((addedTask) => {
          console.log('Tâche ajoutée:', addedTask);
          setTasks([...tasks, addedTask]);
          setNewTask('');
          setSelectedCategory('');
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

  // Fonction pour activer le mode édition
  const enableEdit = (task) => {
    setEditTaskId(task.id); // Active le mode édition pour cette tâche
    setEditTaskText(task.text); // Remplit l'input avec le texte existant
  };

  // Fonction pour mettre à jour une tâche
  const updateTask = (taskId) => {
    if (editTaskText.trim() !== '') {
      fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: editTaskText,
          completed: tasks.find(task => task.id === taskId).completed,
        }),
      })
        .then((response) => response.json())
        .then((updatedTask) => {
          setTasks(
            tasks.map((task) =>
              task.id === taskId ? { ...task, text: updatedTask.text } : task
            )
          );
          setEditTaskId(null); // Quitter le mode édition
          setEditTaskText('');
        })
        .catch((error) => console.error('Error updating task:', error));
    }
  };

  const toggleTaskCompletion = (taskId) => {
    fetch(`http://localhost:8080/tasks/${taskId}/complete`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks(tasks.map((task) => 
          task.id === taskId ? updatedTask : task // Met à jour la tâche
        ));
      })
      .catch((error) => console.error('Error toggling task completion:', error));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("light-mode");
  };
  

  return (
    <div className="App">
      <h1>Gestion des Tâches</h1>

      <button onClick={toggleDarkMode} style={{ marginBottom: "20px" }}>
        {darkMode ? "Basculer en Light Mode ☀️" : "Basculer en Dark Mode 🌙"}
      </button>

      {/* Formulaire pour ajouter une tâche */}
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Ajouter une tâche"
          style={{ marginRight: "40px" }}
        />
        {/* Sélecteur de catégorie */}
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ marginRight: "50px" }}
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
        ))}
        </select>
        <button onClick={addTask}>Ajouter</button>
      </div>

      {/* Liste des tâches */}
      <div>
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
            {editTaskId === task.id ? ( // Si cette tâche est en mode édition
          <>
            <input
              type="text"
              value={editTaskText}
              onChange={(e) => setEditTaskText(e.target.value)} // on gère la saisie
            />
            <button onClick={() => updateTask(task.id)}>Enregistrer</button>
            <button onClick={() => setEditTaskId(null)}>Annuler</button>
          </>
        ) : ( 
          <>
          {/* Case à cocher pour marquer la tâche comme complétée */}
          <div className="task-content">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTaskCompletion(task.id, task.completed)}
          />
            {task.category && task.category.name && (
              <span style={{ fontWeight: "bold", marginLeft: "20px",
                color: 
                  task.category.name === "Long terme" ? "orange" :
                  task.category.name === "Travail" ? "blue" :
                  task.category.name === "Urgent" ? "red" :
                  "black"
              }}>
                Catégorie : {task.category.name} / &nbsp;
              </span> // Affichage de la catégorie
            )}
            <span className="task-text"
              style={{
                textDecoration: task.completed ? "line-through" : "none", // texte barré si la tâche est complétée
                color: task.completed ? "gray" : "white", // on change la couleur du texte si la tâche est complétée
              }}
            >
              {task.text} {/* Affiche ici le texte de la tâche */}
            </span>
            <span className="task-date">
              {task.createdAt ? `(${new Date(task.createdAt).toLocaleDateString()})`: "(Date inconnue)"}
            </span>
            </div>

            <div className="task-buttons">
            <button onClick={() => enableEdit(task)}
              style={{ marginRight: "30px" }}
              >Modifier</button>
            <button onClick={() => deleteTask(task.id)}>Supprimer</button>
            </div>
          </>
        )}
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
}

export default App;