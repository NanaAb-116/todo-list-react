import './App.css';
import React, { useState, useEffect } from 'react';
import Todos from './components/Todos';
import Alert from './components/Alert';
import { AiOutlinePlus } from 'react-icons/ai';
import { FaEdit } from 'react-icons/fa';

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return JSON.parse(localStorage.getItem('list'));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [status, setStatus] = useState('all');
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    msg: '',
    type: '',
  });

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
    filterHandler();
  }, [list, status]);

  const filterHandler = () => {
    switch (status) {
      case 'completed':
        setFilteredTodos(list.filter((todo) => todo.completed === true));
        break;
      case 'uncompleted':
        setFilteredTodos(list.filter((todo) => todo.completed === false));
        break;
      default:
        setFilteredTodos(list);
        break;
    }
  };

  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, 'danger', "you didn't enter anything");
    } else if (name && isEditing) {
      // edit
      setList(
        list.map((item) => {
          if (item.id === editID)
            return { ...item, title: name, completed: false };
          return item;
        })
      );
      setName('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true, 'success', 'value changed');
    } else {
      showAlert(true, 'success', 'item added to the list');
      const newItem = {
        id: new Date().getTime().toString(),
        title: name,
        completed: false,
      };
      setList([...list, newItem]);
      setName('');
    }
  };

  const completeTodo = (id) => {
    setList(
      list.map((item) => {
        if (item.id === id) {
          return { ...item, completed: !item.completed };
        }
        return item;
      })
    );
  };

  const clearList = () => {
    setList([]);
  };

  const removeItem = (id) => {
    showAlert(true, 'danger', 'item removed');
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };
  const statusHandler = (e) => {
    setStatus(e.target.value);
  };

  return (
    <section className='main-container'>
      <div className='todo-app'>
        <h1 className='title'>Todo List</h1>
        <div className='alert'>
          {alert.show && (
            <Alert {...alert} removeAlert={showAlert} list={list} />
          )}
        </div>
        <form onSubmit={submitHandler}>
          <input
            type='text'
            id='todo-input'
            placeholder='Enter an item'
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <button type='submit' className='submit-btn'>
            {isEditing ? (
              <FaEdit className='btn' />
            ) : (
              <AiOutlinePlus className='btn' />
            )}
          </button>
          <select name='todos' id='filter' onChange={statusHandler}>
            <option value='all'>All</option>
            <option value='completed'>Completed</option>
            <option value='uncompleted'>Uncompleted</option>
          </select>
        </form>
        {list.length > 0 && (
          <div className='todos-container'>
            <Todos
              list={list}
              removeItem={removeItem}
              editItem={editItem}
              completeTodo={completeTodo}
              filteredTodos={filteredTodos}
            />
            <div className='clear'>
              <button type='button' className='clear-btn' onClick={clearList}>
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default App;
