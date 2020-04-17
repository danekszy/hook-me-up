import React from 'react'

const TodoItem = ({ task, onRemove, onStateToggle }) => {
  const isChecked = task.state === 'done'

  return (
    <li style={{ margin: '15px', borderBottom: '1px solid #999' }}>
      <input
        type='checkbox'
        checked={isChecked}
        onChange={onStateToggle(task.id)}
      />
      <div
        style={{
          fontSize: '0.8em',
          textTransform: 'uppercase',
          fontWeight: 600
        }}
      >
        {new Date(task.createdTime).toLocaleString('pl-pl')}
      </div>
      <div>{task.state}</div>
      <p>{task.body}</p>
      <button onClick={() => onRemove(task.id)}>X</button>
    </li>
  )
}

export default TodoItem
