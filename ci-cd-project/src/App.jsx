import { useEffect, useState } from 'react'
import './App.css'

async function apiRequest(path, options) {
  const response = await fetch(path, options)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.status === 204 ? null : response.json()
}

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    apiRequest('/api/tasks')
      .then((loadedTasks) => {
        if (isCurrent) setTasks(loadedTasks)
      })
      .catch(() => {
        if (isCurrent) setError('Could not load tasks. Is the API server running?')
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    const taskTitle = title.trim()
    if (!taskTitle) return

    setError('')
    setIsSubmitting(true)

    try {
      const task = await apiRequest('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: taskTitle }),
      })
      setTasks((currentTasks) => [...currentTasks, task])
      setTitle('')
    } catch {
      setError('Could not add the task. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleToggle(task) {
    setError('')

    try {
      const updatedTask = await apiRequest(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      })
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id ? updatedTask : currentTask,
        ),
      )
    } catch {
      setError('Could not update the task. Please try again.')
    }
  }

  async function handleDelete(taskId) {
    setError('')

    try {
      await apiRequest(`/api/tasks/${taskId}`, { method: 'DELETE' })
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      )
    } catch {
      setError('Could not delete the task. Please try again.')
    }
  }

  return (
    <main className="app">
      <header className="page-header">
        <p className="eyebrow">A little more focus, every day</p>
        <h1>Task Tracker</h1>
        <p className="intro">Keep track of what you want to get done.</p>
      </header>

      <section className="task-panel" aria-labelledby="tasks-heading">
        <form className="task-form" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="task-title">
            New task
          </label>
          <input
            id="task-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs to get done?"
            maxLength={200}
            required
          />
          <button type="submit" disabled={isSubmitting || !title.trim()}>
            {isSubmitting ? 'Adding…' : 'Add task'}
          </button>
        </form>

        <div className="list-heading">
          <h2 id="tasks-heading">Your tasks</h2>
          <span className="task-count">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {isLoading ? (
          <p className="empty-message" role="status">
            Loading tasks…
          </p>
        ) : tasks.length === 0 ? (
          <p className="empty-message">
            No tasks yet. Add one above to get started.
          </p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li className="task-item" key={task.id}>
                <button
                  className={`task-toggle${task.completed ? ' is-complete' : ''}`}
                  type="button"
                  aria-label={
                    task.completed
                      ? `Mark ${task.title} as incomplete`
                      : `Mark ${task.title} as complete`
                  }
                  aria-pressed={task.completed}
                  onClick={() => handleToggle(task)}
                >
                  <span className="task-check" aria-hidden="true">
                    {task.completed ? '✓' : ''}
                  </span>
                  <span className="task-title">{task.title}</span>
                </button>
                <button
                  className="delete-button"
                  type="button"
                  aria-label={`Delete ${task.title}`}
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="page-footer">One step at a time.</footer>
    </main>
  )
}

export default App
