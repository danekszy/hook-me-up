import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import App from './App'
import dummyTasks from './fixtures/tasks.json'

const CIASTECZKO_TASK = {
  id: 'sfhsdijds',
  createdTime: new Date(),
  state: 'new',
  body: 'CIAASTECZKOO'
}

test('renders first todo item body from fixtures', () => {
  const { getByText } = render(<App initialTasks={dummyTasks} />)
  const todoLabel = getByText(/Lorem ipsum dolor sit amet/i)
  expect(todoLabel).toBeInTheDocument()
})

test('renders add new task input', () => {
  const { getByPlaceholderText } = render(<App />)
  const $input = getByPlaceholderText('type task')
  expect($input).toBeInTheDocument()
})

test('renders add new task button', () => {
  const { getByText } = render(<App />)
  const $button = getByText('add task')
  expect($button).toBeInTheDocument()
})

test('adds new task when "add task" button is clicked', () => {
  const { getByText, getByPlaceholderText } = render(<App />)
  const $input = getByPlaceholderText('type task')
  const $button = getByText('add task')

  fireEvent.change($input, { target: { value: 'ciasteczko' } })
  fireEvent.click($button)

  const todoLabel = getByText(/ciasteczko/i)
  expect(todoLabel).toBeInTheDocument()
})

//Usuwanie taskow
test('task has X button', () => {
  const { getByRole, debug } = render(<App initialTasks={[CIASTECZKO_TASK]} />)
  const removeTaskButton = getByRole('button', { name: 'X' })
  expect(removeTaskButton).toBeInTheDocument()
})

test('removes task when X button is clicked', () => {
  const { getByRole, getByText } = render(
    <App initialTasks={[CIASTECZKO_TASK]} />
  )
  const $removeTaskButton = getByRole('button', { name: 'X' })
  const $task = getByText(CIASTECZKO_TASK.body)
  expect($task).toBeInTheDocument()

  fireEvent.click($removeTaskButton)

  expect($removeTaskButton).not.toBeInTheDocument()
  expect($task).not.toBeInTheDocument()
})
