import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it } from 'node:test'
import { createApp } from './app.js'

describe('task API', () => {
  let server
  let baseUrl

  beforeEach(async () => {
    server = createApp().listen(0)
    await new Promise((resolve) => server.once('listening', resolve))
    baseUrl = `http://127.0.0.1:${server.address().port}`
  })

  afterEach(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()))
    })
  })

  it('starts with an empty task list', async () => {
    const response = await fetch(`${baseUrl}/api/tasks`)

    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), [])
  })

  it('adds a task after trimming its title', async () => {
    const response = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '  Write tests  ' }),
    })

    assert.equal(response.status, 201)
    assert.deepEqual(await response.json(), {
      id: 1,
      title: 'Write tests',
      completed: false,
    })
  })

  it('rejects an empty task title', async () => {
    const response = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '   ' }),
    })

    assert.equal(response.status, 400)
    assert.deepEqual(await response.json(), {
      error: 'Task title is required.',
    })
  })

  it('marks a task as completed', async () => {
    const createdResponse = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Finish MVP' }),
    })
    const task = await createdResponse.json()
    const response = await fetch(`${baseUrl}/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    })

    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { ...task, completed: true })
  })

  it('deletes a task', async () => {
    const createdResponse = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Remove me' }),
    })
    const task = await createdResponse.json()
    const deleteResponse = await fetch(`${baseUrl}/api/tasks/${task.id}`, {
      method: 'DELETE',
    })
    const listResponse = await fetch(`${baseUrl}/api/tasks`)

    assert.equal(deleteResponse.status, 204)
    assert.deepEqual(await listResponse.json(), [])
  })
})
