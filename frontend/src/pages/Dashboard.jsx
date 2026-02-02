import { useEffect, useState, useContext } from 'react'
import API from '../utils/api'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const toast = useToast()

  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Edit State
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editStatus, setEditStatus] = useState('todo')

  // Fetch Tasks
  const fetchTasks = async () => {
    setLoading(true)
    try {
      const res = await API.get('/tasks/gp')
      if (Array.isArray(res.data)) {
        setTasks(res.data)
      } else if (res.data && Array.isArray(res.data.tasks)) {
        setTasks(res.data.tasks)
      } else {
        setTasks([])
      }
    } catch (err) {
      console.error(err)
      toast.error('Could not load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // Create Task
  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return

    try {
      await API.post('/tasks/gp', { title: newTask, description, status: 'todo' })
      setNewTask('')
      setDescription('')
      fetchTasks()
      toast.success('Task created successfully')
    } catch (err) {
      console.error(err)
      toast.error('Failed to add task')
    }
  }

  // Update Task
  const startEditing = (task) => {
    setEditingId(task._id)
    setEditTitle(task.title)
    setEditDesc(task.description || '')
    setEditStatus(task.status)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditTitle('')
    setEditDesc('')
  }

  const handleUpdate = async (id) => {
    try {
      await API.put(`/tasks/${id}/gp`, {
        title: editTitle,
        description: editDesc,
        status: editStatus
      })

      // Optimistic update
      setTasks(tasks.map(t =>
        t._id === id ? { ...t, title: editTitle, description: editDesc, status: editStatus } : t
      ))
      setEditingId(null)
      toast.success('Task updated')
    } catch (err) {
      console.error(err)
      toast.error('Failed to update task')
    }
  }

  // Delete Task
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    try {
      await API.delete(`/tasks/${id}/gp`)
      setTasks(tasks.filter(t => t._id !== id))
      toast.success('Task deleted')
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete')
    }
  }

  // Filter & Search Logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-red-600 rounded-full opacity-20 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-gray-400 text-lg">You have {tasks.length} active tasks today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Task Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-2 h-8 bg-red-600 rounded-full"></div>
              New Task
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 transition-all outline-none text-gray-800 placeholder-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={!newTask.trim()}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-red-500/40 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>

        {/* Task List Section */}
        <div className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-800">Your Tasks</h2>

            {/* Search & Filter Controls */}
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none text-sm w-full sm:w-48"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none text-sm bg-white"
              >
                <option value="all">All</option>
                <option value="todo">Todo</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div></div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-lg">No tasks found.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map(task => (
                <div key={task._id} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1">
                  {editingId === task._id ? (
                    // EDIT MODE
                    <div className="space-y-3">
                      <input
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="w-full text-lg font-bold border-b border-gray-200 focus:border-red-500 outline-none pb-1"
                        placeholder="Task Title"
                      />
                      <textarea
                        value={editDesc}
                        onChange={e => setEditDesc(e.target.value)}
                        className="w-full text-gray-600 text-sm border p-2 rounded focus:ring-1 focus:ring-red-500 outline-none"
                        placeholder="Description"
                        rows={2}
                      />
                      <div className="flex items-center gap-4">
                        <select
                          value={editStatus}
                          onChange={e => setEditStatus(e.target.value)}
                          className="text-sm border rounded p-1"
                        >
                          <option value="todo">Todo</option>
                          <option value="inprogress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                        <div className="flex gap-2 ml-auto">
                          <button onClick={() => handleUpdate(task._id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Save</button>
                          <button onClick={cancelEditing} className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400">Cancel</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // VIEW MODE
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors">{task.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${task.status === 'done' ? 'bg-green-100 text-green-700' :
                            task.status === 'inprogress' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-50 text-red-600'
                            }`}>
                            {task.status}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm line-clamp-2">{task.description}</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => startEditing(task)}
                          className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

Dashboard.displayName = 'Dashboard'
export default Dashboard
