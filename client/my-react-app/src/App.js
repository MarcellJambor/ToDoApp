import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskName, setEditingTaskName] = useState('');

  const api = process.env.API_URL;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${api}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${api}add`, {
        task: newTask,
        done: false,
      });
      setNewTask('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      await axios.post(`${api}toggle/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${api}delete/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditingTask = (taskId, taskName) => {
    setEditingTaskId(taskId);
    setEditingTaskName(taskName);
  };

  const handleSaveTask = async (taskId) => {
    try {
      await axios.put(`h${api}update/${taskId}`, { task: editingTaskName });
      setEditingTaskId(null);
      setEditingTaskName('');
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="App">
      <div className='header'>
        <h1>To Do App</h1>
      </div>
      <div className='input'>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder='Task'
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>
      </div>
      <div className='items'>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {editingTaskId === task.id ? (
                <div className='editing'>
                  <input
                    className='edit'
                    type="text"
                    value={editingTaskName}
                    onChange={(e) => setEditingTaskName(e.target.value)}
                  />
                  <button onClick={() => handleSaveTask(task.id)}>Save</button>
                </div>
              ) : (
                <>
                  {task.task} - {task.done ? '✓' : '☐'}
                  <div className='buttons'>
                    <button onClick={() => handleToggleTask(task.id)}>Done</button>
                    <button onClick={() => handleEditingTask(task.id, task.task)}>Edit</button>
                    <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
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

