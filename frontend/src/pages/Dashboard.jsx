import React, { useEffect, useState, useContext } from 'react'
import API from '../utils/api'
import AuthContext from '../context/AuthContext'
import TaskItem from '../components/TaskItem'
import { toast } from 'react-toastify'
import ConfirmModal from '../components/ConfirmModal'

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext)
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(false)
  const [titleError, setTitleError] = useState('')

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  // useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const res = await API.get('/tasks/gp')
      // Defensive check: ensure res.data is an array
      if (Array.isArray(res.data)) {
        setTasks(res.data)
      } else if (res.data && Array.isArray(res.data.tasks)) {
        // Handle possible nested structure
        setTasks(res.data.tasks)
      } else {
        console.warn('Unexpected API response format:', res.data)
        setTasks([])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch tasks')
      setTasks([]) // Ensure array on error
    } finally {
      setLoading(false)
    }
  }

  const create = async (e) => {
    e.preventDefault()
    setTitleError('')
    if (!title.trim()) { setTitleError('Title is required'); return }
    try {
      await API.post('/tasks/gp', { title, description: desc, status: 'todo' })
      setTitle(''); setDesc('')
      toast.success('Task created')
      fetchTasks()
    } catch (err) {
      console.error(err)
      toast.error('Failed to create task')
    }
  }

  const updateTask = async (id, data) => {
    try {
      await API.put(`/tasks/${id}/gp`, data)
      toast.success('Task updated')
      fetchTasks()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update task')
    }
  }

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}/gp`)
      toast.success('Task deleted')
      setTasks(prev => prev.filter(t => t._id !== id))
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete task')
    }
  }

  const requestDelete = (id) => { setConfirmId(id); setConfirmOpen(true) }
  const handleConfirmDelete = async () => { if (!confirmId) return; await deleteTask(confirmId); setConfirmOpen(false); setConfirmId(null) }

  // Safe filtering: ensure tasks is an array
  const taskList = Array.isArray(tasks) ? tasks : []
  const filtered = taskList.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false
    if (search && !(t.title.toLowerCase().includes(search.toLowerCase()) || (t.description || '').toLowerCase().includes(search.toLowerCase()))) return false
    return true
  })

  console.log('DASHBOARD DEBUG:', { TaskItem, ConfirmModal })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-4">
          {user && <span className="text-gray-700 font-medium">{user.name}</span>}
        </div>
      </div>

      <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
        Debugging Mode: Children removed.
      </div>

      {/* 
      <ConfirmModal
        open={confirmOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
      */}
    </div>
  )
}


export default Dashboard
