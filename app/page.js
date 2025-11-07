'use client'

import { useState, useEffect } from 'react'

export default function TodoApp() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const saved = localStorage.getItem('insane-todos')
    if (saved) setTodos(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('insane-todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (input.trim()) {
      setTodos([{ id: Date.now(), text: input, done: false, timestamp: Date.now() }, ...todos])
      setInput('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  const filtered = todos.filter(t =>
    filter === 'all' ? true :
    filter === 'active' ? !t.done : t.done
  )

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.done).length,
    done: todos.filter(t => t.done).length
  }

  return (
    <div style={styles.container}>
      <div style={styles.background}>
        <div style={styles.blob1}></div>
        <div style={styles.blob2}></div>
        <div style={styles.blob3}></div>
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>✨ Tasks</h1>
          <div style={styles.stats}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{stats.active}</span>
              <span style={styles.statLabel}>Active</span>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{stats.done}</span>
              <span style={styles.statLabel}>Done</span>
            </div>
          </div>
        </div>

        <div style={styles.inputContainer}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="What needs to be done?"
            style={styles.input}
          />
          <button onClick={addTodo} style={styles.addButton}>
            <span style={styles.addIcon}>+</span>
          </button>
        </div>

        <div style={styles.filterContainer}>
          {['all', 'active', 'done'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.filterButton,
                ...(filter === f ? styles.filterButtonActive : {})
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div style={styles.todoList}>
          {filtered.length === 0 ? (
            <div style={styles.empty}>
              <span style={styles.emptyIcon}>🎯</span>
              <p style={styles.emptyText}>
                {filter === 'all' ? 'No tasks yet. Add one!' :
                 filter === 'active' ? 'No active tasks!' :
                 'No completed tasks yet!'}
              </p>
            </div>
          ) : (
            filtered.map((todo, index) => (
              <div
                key={todo.id}
                style={{
                  ...styles.todoItem,
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  style={{
                    ...styles.checkbox,
                    ...(todo.done ? styles.checkboxChecked : {})
                  }}
                >
                  {todo.done && <span style={styles.checkmark}>✓</span>}
                </button>
                <span style={{
                  ...styles.todoText,
                  ...(todo.done ? styles.todoTextDone : {})
                }}>
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={styles.deleteButton}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    position: 'relative',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflow: 'hidden',
  },
  background: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    zIndex: 0,
  },
  blob1: {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '60%',
    height: '60%',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    animation: 'blob 7s infinite ease-in-out',
  },
  blob2: {
    position: 'absolute',
    bottom: '-10%',
    right: '-10%',
    width: '70%',
    height: '70%',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    animation: 'blob 9s infinite ease-in-out 2s',
  },
  blob3: {
    position: 'absolute',
    top: '40%',
    left: '30%',
    width: '50%',
    height: '50%',
    background: 'rgba(118, 75, 162, 0.3)',
    borderRadius: '50%',
    filter: 'blur(70px)',
    animation: 'blob 8s infinite ease-in-out 4s',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    paddingTop: '20px',
  },
  title: {
    fontSize: '48px',
    fontWeight: '800',
    color: 'white',
    margin: '0 0 20px 0',
    textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    letterSpacing: '-1px',
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '15px 30px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
  },
  statLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  statDivider: {
    width: '1px',
    height: '30px',
    background: 'rgba(255, 255, 255, 0.3)',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: 1,
    padding: '18px 24px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    outline: 'none',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    fontWeight: '500',
  },
  addButton: {
    width: '56px',
    height: '56px',
    border: 'none',
    borderRadius: '18px',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
    fontSize: '32px',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(245, 87, 108, 0.4)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    display: 'block',
    lineHeight: '1',
  },
  filterContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  filterButton: {
    flex: 1,
    padding: '12px',
    border: 'none',
    borderRadius: '14px',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'capitalize',
  },
  filterButtonActive: {
    background: 'rgba(255, 255, 255, 0.95)',
    color: '#667eea',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
  todoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  todoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '18px 20px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '18px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    animation: 'fadeInUp 0.5s ease forwards',
    opacity: 0,
  },
  checkbox: {
    width: '28px',
    height: '28px',
    minWidth: '28px',
    border: '2.5px solid #667eea',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    padding: 0,
  },
  checkboxChecked: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderColor: '#764ba2',
  },
  checkmark: {
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  todoText: {
    flex: 1,
    fontSize: '16px',
    color: '#2d3748',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    wordBreak: 'break-word',
  },
  todoTextDone: {
    textDecoration: 'line-through',
    color: '#a0aec0',
  },
  deleteButton: {
    width: '32px',
    height: '32px',
    minWidth: '32px',
    border: 'none',
    borderRadius: '10px',
    background: 'rgba(245, 87, 108, 0.1)',
    color: '#f5576c',
    fontSize: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    lineHeight: '1',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '64px',
    display: 'block',
    marginBottom: '20px',
  },
  emptyText: {
    color: 'white',
    fontSize: '18px',
    fontWeight: '500',
    margin: 0,
    opacity: 0.9,
  },
}
