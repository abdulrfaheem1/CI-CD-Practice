import express from 'express'

export function createApp() {
  const app = express()
  let nextId = 1
  const tasks = []

  app.use(express.json())

  app.get('/api/tasks', (_request, response) => {
    response.json(tasks)
  })

  app.post('/api/tasks', (request, response) => {
    const title =
      typeof request.body?.title === 'string' ? request.body.title.trim() : ''

    if (!title) {
      return response.status(400).json({ error: 'Task title is required.' })
    }

    const task = { id: nextId, title, completed: false }
    nextId += 1
    tasks.push(task)

    return response.status(201).json(task)
  })

  app.patch('/api/tasks/:id', (request, response) => {
    const task = tasks.find((item) => item.id === Number(request.params.id))

    if (!task) {
      return response.status(404).json({ error: 'Task not found.' })
    }

    if (typeof request.body?.completed !== 'boolean') {
      return response
        .status(400)
        .json({ error: 'Completed must be true or false.' })
    }

    task.completed = request.body.completed
    return response.json(task)
  })

  app.delete('/api/tasks/:id', (request, response) => {
    const taskIndex = tasks.findIndex(
      (item) => item.id === Number(request.params.id),
    )

    if (taskIndex === -1) {
      return response.status(404).json({ error: 'Task not found.' })
    }

    tasks.splice(taskIndex, 1)
    return response.status(204).end()
  })

  return app
}
