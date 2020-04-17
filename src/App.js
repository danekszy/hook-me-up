import React, { useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import AddItem from './components/AddItem'
import TodoList from './components/TodoList'
import dummyTasks from './fixtures/tasks.json'
import { useTasksReducer } from './useTasksReducer'

function App ({ initalState }) {
  const [state, dispatch] = useTasksReducer(initalState)

  const { tasks, error, isLoading } = state

  const onRemoveTask = taskId => {
    dispatch({ type: 'REMOVE_TASK', taskId })
  }

  const addTask = body => {
    const newTask = {
      id: uuidv4(),
      createdTime: new Date(),
      state: 'new',
      body
    }

    dispatch({ type: 'ADD_TASK', newTask })
  }

  const onStateToggle = taskId => e => {
    const newState = e.target.checked ? 'done' : 'new'
    dispatch({ type: 'UPDATE_TASK_STATE', taskId, newState })
  }

  const fetchData = useCallback(() => dispatch({ type: 'FETCH_DATA' }), [
    dispatch
  ])

  useEffect(() => {
    console.log('init')
    fetchData()
  }, [fetchData])

  return (
    <div className='App'>
      {/* <button onClick={fetchData}>Pobierz</button> */}
      <AddItem onAdd={addTask}></AddItem>
      {isLoading && <strong>Ładowanie</strong>}
      {error ? (
        <strong>{error}</strong>
      ) : (
        <TodoList
          tasks={tasks}
          onRemoveTask={onRemoveTask}
          onStateToggle={onStateToggle}
        ></TodoList>
      )}
    </div>
  )
}

export default App
