import React, { useState } from 'react'

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [status, setStatus] = useState(task.status)

  const save = async () => {
    await onUpdate(task._id, { title, description, status })
    setEditing(false)
  }

  return (
    <div
      className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col sm:flex-row sm:justify-between gap-4"
      role="article"
      aria-labelledby={`task-${task._id}-title`}
    >
      {/* Task Info */}
      <div className="flex-1">
        {editing ? (
          <div className="space-y-3">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Task Title"
            />
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Task Description"
              rows={3}
            />
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="todo">Todo</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        ) : (
          <div>
            <h3
              id={`task-${task._id}-title`}
              className="text-lg font-semibold text-gray-800 mb-1"
            >
              {task.title}
            </h3>
            <p className="text-gray-600 text-sm">{task.description}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3 sm:mt-0">
        {editing ? (
          <>
            <button
              onClick={save}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <span
              role="status"
              aria-label={`Status: ${task.status}`}
              className={`text-sm px-3 py-1 rounded-full font-medium ${
                task.status === 'done'
                  ? 'bg-green-100 text-green-800'
                  : task.status === 'inprogress'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {task.status}
            </span>
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default TaskItem
