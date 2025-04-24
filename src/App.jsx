import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    createStars();
  }, []);

  const createStars = () => {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    document.body.appendChild(starsContainer);

    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      starsContainer.appendChild(star);
    }
  };

  const getTaskImage = async (text) => {
    try {
      const response = await fetch(`https://source.unsplash.com/featured/400x300/?${encodeURIComponent(text)}`);
      return response.url;
    } catch (error) {
      return 'https://source.unsplash.com/featured/400x300/?task';
    }
  };

  const handleAddTodo = async () => {
    if (inputValue.trim() !== '') {
      const imageUrl = await getTaskImage(inputValue);
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: inputValue,
          completed: false,
          image: imageUrl,
          date: new Date().toLocaleString()
        }
      ]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  const handleToggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleEditStart = (todo) => {
    setEditingId(todo.id);
    setEditValue(todo.text);
  };

  const handleEditSave = async (id) => {
    if (editValue.trim() !== '') {
      const imageUrl = await getTaskImage(editValue);
      setTodos(todos.map(todo =>
        todo.id === id ? { 
          ...todo, 
          text: editValue,
          image: imageUrl,
          date: new Date().toLocaleString() + ' (edited)'
        } : todo
      ));
      setEditingId(null);
      setEditValue('');
    }
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h1>Todo List</h1>
      </div>
      
      <div className="todo-input-container">
        <input
          type="text"
          className="todo-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
        />
        <button className="add-button" onClick={handleAddTodo}>
          Add Task
        </button>
      </div>

      <ul className="todo-list">
        {todos.map(todo => (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? 'completed' : ''} ${editingId === todo.id ? 'edit-mode' : ''}`}
          >
            <img src={todo.image} alt="" className="todo-image" />
            <div className="todo-content">
              {editingId === todo.id ? (
                <input
                  type="text"
                  className="edit-input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEditSave(todo.id)}
                  autoFocus
                />
              ) : (
                <>
                  <p className="todo-text">{todo.text}</p>
                  <span className="todo-date">{todo.date}</span>
                </>
              )}
            </div>
            <div className="todo-actions">
              <button
                className="todo-button complete-button"
                onClick={() => handleToggleComplete(todo.id)}
              >
                <FontAwesomeIcon icon={faCheck} />
                {todo.completed ? 'Undo' : 'Complete'}
              </button>
              {editingId === todo.id ? (
                <button
                  className="todo-button edit-button"
                  onClick={() => handleEditSave(todo.id)}
                >
                  <FontAwesomeIcon icon={faSave} />
                  Save
                </button>
              ) : (
                <button
                  className="todo-button edit-button"
                  onClick={() => handleEditStart(todo)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Edit
                </button>
              )}
              <button
                className="todo-button delete-button"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;