import { useReducer, useCallback } from 'react'

function fetchDataFromAPI () {
  return fetch('https://fakes.herokuapp.com/tasks').then(resp => resp.json())
}

function removeTask (taskId) {
  return fetch(`https://fakes.herokuapp.com/tasks/${taskId}`, {
    method: 'DELETE'
  })
}

function addTask (task) {
  return fetch(`https://fakes.herokuapp.com/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(task)
  })
}

function updateTaskState (taskId, newState) {
  return fetch(`https://fakes.herokuapp.com/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ state: newState })
  })
}

function reducer (state, action) {
  const tasks = state.tasks

  switch (action.type) {
    case 'REMOVE_TASK':
      const index = tasks.findIndex(task => task.id === action.taskId)
      const copyTasks = [...tasks]
      copyTasks.splice(index, 1)
      return {
        ...state,
        tasks: copyTasks
      }

    case 'ADD_TASK':
      return {
        ...state,
        isLoading: true
      }

    case 'ADD_TASK__SUCCESS':
      return {
        ...state,
        isLoading: false,
        tasks: [...tasks, action.newTask]
      }

    case 'UPDATE_TASK_STATE':
      const taskIndex = tasks.findIndex(item => item.id === action.taskId)
      const newTask = { ...tasks[taskIndex], state: action.newState }
      return {
        ...state,
        tasks: [
          ...tasks.slice(0, taskIndex),
          newTask,
          ...tasks.slice(taskIndex + 1)
        ]
      }

    case 'FETCH_DATA':
      return {
        ...state,
        isLoading: true
      }

    case 'FETCH_DATA__SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: '',
        tasks: [...action.data]
      }

    case 'FETCH_DATA__FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.error.message
      }

    default:
      return state
  }
}

function makeDispatchWithNetworking (state, dispatch) {
  const dispatchWithNetworking = action => {
    console.log('act', action)
    if (action.type === 'FETCH_DATA') {
      fetchDataFromAPI()
        .then(data => {
          return dispatchWithNetworking({ type: 'FETCH_DATA__SUCCESS', data })
        })
        .catch(err => {
          return dispatchWithNetworking({
            type: 'FETCH_DATA__FAILURE',
            error: err
          })
        })
    }
    return dispatch(action)
  }
  return dispatchWithNetworking
}

function makeDispatchWithNetworking2 (state, dispatch) {
  const dispatchWithNetworking2 = action => {
    console.log('act', action)
    if (action.type === 'REMOVE_TASK') {
      removeTask(action.taskId).then(() => {
        console.log('API Delete Success')
      })
    } else if (action.type === 'ADD_TASK') {
      addTask(action.newTask).then(() => {
        console.log('API Create Success')
        return dispatchWithNetworking2({
          type: 'ADD_TASK__SUCCESS',
          newTask: action.newTask
        })
      })
    } else if (action.type === 'UPDATE_TASK_STATE') {
      updateTaskState(action.taskId, action.newState).then(() => {
        console.log('API Update Success')
      })
    }
    return dispatch(action)
  }
  return dispatchWithNetworking2
}

function composeMiddlewares (middlewares, state, dispatch) {
  return middlewares.reduce((acc, item) => {
    return item(state, acc)
  }, dispatch)
}

export function useTasksReducer (
  initialState = { tasks: [], isLoading: false }
) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const dispatchMiddlewares = composeMiddlewares(
    [makeDispatchWithNetworking, makeDispatchWithNetworking2],
    state,
    dispatch
  )
  return [state, useCallback(dispatchMiddlewares, [])]
}
