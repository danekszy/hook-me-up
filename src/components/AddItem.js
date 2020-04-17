import React, { useState } from 'react'

const AddItem = ({ onAdd }) => {
  const [inputValue, setInputValue] = useState('')
  const onInputChange = e => {
    setInputValue(e.target.value)
  }
  const onFormSubmit = e => {
    e.preventDefault()
    onAdd(inputValue)
    setInputValue('')
  }

  return (
    <form onSubmit={onFormSubmit}>
      <input
        type='text'
        placeholder='type task'
        value={inputValue}
        onChange={onInputChange}
      />
      <button>add task</button>
    </form>
  )
}

export default AddItem
