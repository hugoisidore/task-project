import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null); 
  const [editTaskText, setEditTaskText] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
 
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
          category: selectedCategory ? { id: selectedCategory } : null
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
        body: JSON.stringify({ text: editTaskText }),
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
        {/* Sélecteur de catégorie */}
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
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
          <li key={task.id}>
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
        ) : ( // Si cette tâche n'est pas en mode édition
          <>
            {task.category && task.category.name && (
              <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                Catégorie : {task.category.name} / &nbsp;
              </span> // Affichage de la catégorie
            )}
            {task.text}{/* Affiche ici le texte de la tâche */}
            <button onClick={() => enableEdit(task)}>Modifier</button>
            <button onClick={() => deleteTask(task.id)}>Supprimer</button>
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