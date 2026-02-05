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
  const [taskColor, setTaskColor] = useState('#D7263D')
  const [recurrence, setRecurrence] = useState('none')
  const [loading, setLoading] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRecurrence, setFilterRecurrence] = useState('all')

  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editStatus, setEditStatus] = useState('todo')
  const [editColor, setEditColor] = useState('#D7263D')
  const [editRecurrence, setEditRecurrence] = useState('none')

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

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return

    try {
      await API.post('/tasks/gp', {
        title: newTask,
        description,
        status: 'todo',
        color: taskColor,
        recurrence: recurrence
      })
      setNewTask('')
      setDescription('')
      setTaskColor('#D7263D')
      setRecurrence('none')
      fetchTasks()
      toast.success('Mission Added')
    } catch (err) {
      console.error(err)
      toast.error('Deployment Failed')
    }
  }

  const startEditing = (task) => {
    setEditingId(task._id)
    setEditTitle(task.title)
    setEditDesc(task.description || '')
    setEditStatus(task.status)
    setEditColor(task.color || '#D7263D')
    setEditRecurrence(task.recurrence || 'none')
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
        status: editStatus,
        color: editColor,
        recurrence: editRecurrence
      })
      setTasks(tasks.map(t =>
        t._id === id ? {
          ...t,
          title: editTitle,
          description: editDesc,
          status: editStatus,
          color: editColor,
          recurrence: editRecurrence
        } : t
      ))
      setEditingId(null)
      toast.success('Data Updated')
    } catch (err) {
      console.error(err)
      toast.error('Update Failed')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Terminate this mission?')) return
    try {
      await API.delete(`/tasks/${id}/gp`)
      setTasks(tasks.filter(t => t._id !== id))
      toast.success('Mission Terminated')
    } catch (err) {
      console.error(err)
      toast.error('Deletion Failed')
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesRecurrence = filterRecurrence === 'all' || task.recurrence === filterRecurrence
    return matchesSearch && matchesStatus && matchesRecurrence
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  // Stats
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    active: tasks.filter(t => t.status === 'inprogress').length,
    done: tasks.filter(t => t.status === 'done').length,
    percent: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) : 0
  }

  return (
    <div className="min-h-screen bg-[#F9F6EE] px-4 sm:px-8 py-12 space-y-16 animate-fade-in font-sans selection:bg-[#D7263D] selection:text-white">
      {/* Header Stat GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-4 border-[#0F0F0F] shadow-hard-lg animate-slide-up bg-white">
        <button
          onClick={() => { setFilterStatus('all'); setFilterRecurrence('all'); }}
          className={`p-8 border-r-4 border-[#0F0F0F] text-left transition-all ${filterStatus === 'all' && filterRecurrence === 'all' ? 'bg-[#0F0F0F] text-white' : 'bg-white text-[#0F0F0F] hover:bg-[#F9F6EE]'}`}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 block text-inherit">Success Rate</span>
          <div className="flex items-end gap-2">
            <span className="text-6xl font-black italic tracking-tighter">{stats.percent}%</span>
          </div>
        </button>
        <button
          onClick={() => setFilterStatus('todo')}
          className={`p-8 border-r-4 border-[#0F0F0F] text-left transition-all ${filterStatus === 'todo' ? 'bg-[#D7263D] text-white' : 'bg-white text-[#0F0F0F] hover:bg-[#F9F6EE]'}`}
        >
          <span className={`text-[10px] font-black uppercase tracking-[0.3em] block ${filterStatus === 'todo' ? 'text-white' : 'text-[#D7263D]'}`}>Pending</span>
          <span className="text-6xl font-black italic tracking-tighter leading-none">{stats.todo}</span>
        </button>
        <button
          onClick={() => setFilterStatus('inprogress')}
          className={`p-8 border-r-4 border-[#0F0F0F] text-left transition-all ${filterStatus === 'inprogress' ? 'bg-[#0F0F0F] text-white' : 'bg-white text-[#0F0F0F] hover:bg-[#F9F6EE]'}`}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 block text-inherit">Active</span>
          <span className="text-6xl font-black italic tracking-tighter leading-none">{stats.active}</span>
        </button>
        <button
          onClick={() => setFilterStatus('done')}
          className={`p-8 text-left transition-all ${filterStatus === 'done' ? 'bg-[#D7263D] text-white' : 'bg-[#D7263D] text-white/50 hover:text-white'}`}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] block text-inherit">Completed</span>
          <span className="text-6xl font-black italic tracking-tighter leading-none">{stats.done}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* CREATE SECTION */}
        <div className="lg:col-span-4 sticky top-32 space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white p-8 border-4 border-[#0F0F0F] shadow-hard">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-8 border-b-4 border-[#D7263D] pb-2 text-[#0F0F0F]">Assign Mission</h2>

            <form onSubmit={handleAdd} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D7263D]">Objective</label>
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="CODE NAME..."
                  className="w-full bg-[#F9F6EE] border-2 border-[#0F0F0F] p-4 text-sm font-black uppercase tracking-widest focus:bg-white focus:shadow-hard-red transition-all outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D7263D]">Intel/Details</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ADDITIONAL MISSION PARAMETERS..."
                  rows={4}
                  className="w-full bg-[#F9F6EE] border-2 border-[#0F0F0F] p-4 text-sm font-bold uppercase tracking-widest focus:bg-white focus:shadow-hard transition-all outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#D7263D]">ID Color</label>
                  <div className="flex items-center gap-2 bg-[#F9F6EE] border-2 border-[#0F0F0F] p-2">
                    <input
                      type="color"
                      value={taskColor}
                      onChange={(e) => setTaskColor(e.target.value)}
                      className="w-8 h-8 cursor-pointer border-none bg-transparent"
                    />
                    <span className="text-[10px] font-black font-mono">{taskColor}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#D7263D]">Frequency</label>
                  <select
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value)}
                    className="w-full h-12 bg-[#F9F6EE] border-2 border-[#0F0F0F] px-4 appearance-none font-black text-xs uppercase tracking-widest"
                  >
                    <option value="none">One-Off</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!newTask.trim()}
                className="w-full py-5 bg-[#0F0F0F] text-white font-black uppercase italic tracking-[0.25em] text-sm border-2 border-[#0F0F0F] shadow-hard hover:bg-[#D7263D] hover:shadow-hard-red active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
              >
                DEPLOY MISSION
              </button>
            </form>
          </div>
        </div>

        {/* FEED SECTION */}
        <div className="lg:col-span-8 space-y-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6 border-b-8 border-[#0F0F0F] pb-6">
            <div className="space-y-1">
              <h2 className="text-5xl font-black uppercase tracking-tighter italic text-[#0F0F0F]">Active Feed</h2>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-[#D7263D] animate-pulse shadow-md shadow-red-500/50"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Sector-01 Active</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full sm:w-auto">
              <div className="flex gap-2">
                {['all', 'daily', 'weekly', 'monthly'].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setFilterRecurrence(freq)}
                    className={`flex-1 sm:flex-none px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-[#0F0F0F] transition-all ${filterRecurrence === freq ? 'bg-[#D7263D] text-white shadow-hard' : 'bg-white text-[#0F0F0F] hover:bg-[#F9F6EE]'}`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="SEARCH RECS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white border-4 border-[#0F0F0F] px-6 py-3 text-xs font-black uppercase tracking-widest outline-none focus:shadow-hard transition-all w-full sm:w-48"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-[#0F0F0F] text-white border-2 border-[#0F0F0F] px-6 py-3 text-[10px] font-black uppercase tracking-widest appearance-none outline-none cursor-pointer"
                >
                  <option value="all">ALL STATUS</option>
                  <option value="todo">PENDING</option>
                  <option value="inprogress">ACTIVE</option>
                  <option value="done">SECURED</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-10">
            {loading ? (
              <div className="flex flex-col items-center py-20 gap-4">
                <div className="w-16 h-4 bg-[#D7263D] animate-bounce"></div>
                <span className="font-black uppercase tracking-[0.5em] text-xs">Syncing Inte...</span>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="py-32 border-4 border-dashed border-[#0F0F0F]/20 flex flex-col items-center justify-center grayscale opacity-30">
                <span className="text-6xl font-black italic uppercase tracking-tighter mb-4">Nothing Found</span>
                <p className="font-black uppercase tracking-[0.3em] text-[10px]">Awaiting Objectives...</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div
                  key={task._id}
                  className="group relative bg-white border-4 border-[#0F0F0F] p-8 shadow-hard hover:shadow-hard-red transition-all duration-300"
                >
                  {/* ID TAG */}
                  <div
                    className="absolute -top-4 -left-4 px-4 py-1 text-[10px] font-black text-white italic border-2 border-white shadow-hard uppercase tracking-widest"
                    style={{ backgroundColor: task.color || '#D7263D' }}
                  >
                    ID: {task._id.slice(-6).toUpperCase()}
                  </div>

                  {editingId === task._id ? (
                    <div className="space-y-6 animate-fade-in pt-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <input
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          className="flex-1 bg-[#F9F6EE] border-2 border-[#0F0F0F] p-4 text-xl font-black uppercase outline-none focus:bg-white"
                        />
                        <select
                          value={editStatus}
                          onChange={e => setEditStatus(e.target.value)}
                          className="px-6 bg-[#0F0F0F] text-white font-black uppercase tracking-widest"
                        >
                          <option value="todo">PENDING</option>
                          <option value="inprogress">ACTIVE</option>
                          <option value="done">SECURED</option>
                        </select>
                      </div>
                      <textarea
                        value={editDesc}
                        onChange={e => setEditDesc(e.target.value)}
                        className="w-full bg-[#F9F6EE] border-2 border-[#0F0F0F] p-6 text-sm font-bold uppercase tracking-widest outline-none focus:bg-white resize-none"
                        rows={3}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <select
                            value={editRecurrence}
                            onChange={e => setEditRecurrence(e.target.value)}
                            className="bg-[#F9F6EE] border-2 border-[#0F0F0F] px-4 py-2 font-black uppercase text-[10px] tracking-widest"
                          >
                            <option value="none">One-Off</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                          <input
                            type="color"
                            value={editColor}
                            onChange={e => setEditColor(e.target.value)}
                            className="w-10 h-10 border-2 border-[#0F0F0F] p-1 cursor-pointer"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => handleUpdate(task._id)} className="bg-[#0F0F0F] text-white px-8 py-3 text-xs font-black uppercase italic shadow-hard hover:bg-[#D7263D] active:translate-y-1">SAVE</button>
                          <button onClick={cancelEditing} className="bg-white border-2 border-[#0F0F0F] px-8 py-3 text-xs font-black uppercase italic active:translate-y-1">CANCEL</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-2">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                          <h3 className="text-3xl font-black uppercase italic tracking-tighter text-[#0F0F0F] group-hover:text-[#D7263D] transition-colors">{task.title}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-4 py-1 border-2 border-[#0F0F0F] text-[10px] font-black uppercase tracking-widest italic shadow-hard ${task.status === 'done' ? 'bg-[#0F0F0F] text-white' :
                              task.status === 'inprogress' ? 'bg-[#D7263D] text-white' :
                                'bg-white text-[#0F0F0F]'
                              }`}>
                              {task.status === 'done' ? 'SECURED' : task.status === 'inprogress' ? 'ACTIVE' : 'PENDING'}
                            </span>

                            {task.recurrence && task.recurrence !== 'none' && (
                              <div className="px-3 py-1 bg-white border-2 border-[#0F0F0F] text-[10px] font-black uppercase tracking-tighter text-[#D7263D] flex items-center gap-1 shadow-hard italic">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                {task.recurrence}
                              </div>
                            )}
                          </div>
                        </div>

                        {task.description && (
                          <p className="text-[#0F0F0F] text-xs font-bold uppercase tracking-[0.15em] leading-[1.8] max-w-2xl bg-[#0F0F0F]/5 p-4 border-l-4 border-[#0F0F0F]">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
                          <span>Entry: {new Date(task.createdAt).toLocaleDateString()}</span>
                          <span className="h-1 w-8 bg-slate-200"></span>
                          <span className="text-[#D7263D]">Level: Primary</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-4">
                        <button
                          onClick={() => startEditing(task)}
                          className="w-14 h-14 bg-white border-4 border-[#0F0F0F] flex items-center justify-center hover:bg-[#0F0F0F] hover:text-white transition-all shadow-hard active:translate-x-1 active:translate-y-1 active:shadow-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="w-14 h-14 bg-[#D7263D] text-white border-4 border-[#0F0F0F] flex items-center justify-center hover:bg-white hover:text-[#D7263D] transition-all shadow-hard active:translate-x-1 active:translate-y-1 active:shadow-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

Dashboard.displayName = 'Dashboard'
export default Dashboard
