import React from 'react'
import TodoItem from './TodoItem'

const TodoList = ({ tasks = [], onRemoveTask, onStateToggle }) => {
  return (
    <ul>
      {tasks.map(task => (
        <TodoItem
          key={task.id}
          task={task}
          onRemove={onRemoveTask}
          onStateToggle={onStateToggle}
        />
      ))}
    </ul>
  )
}

export default TodoList
