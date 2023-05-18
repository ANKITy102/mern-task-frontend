import React from 'react'

const TaskForm = ({isEditing, name, handleInputChange, createTask, updateTask }) => {
    return (
        <form className="task-form" onSubmit={isEditing?updateTask:createTask}>
            <input type="text" value={name} onChange={handleInputChange} placeholder="Add a task" name="name" />
            <button type="submit">{isEditing ? "Edit" : "Add"}</button>
        </form>
    )
}

export default TaskForm
