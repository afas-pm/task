import React, { useState, useEffect, useContext } from 'react'
import API from '../utils/api'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { SettingsContext } from '../context/SettingsContext'
import Calendar from '../components/Calendar'

const Dashboard = ({ view = 'overview' }) => {
    const { user } = useContext(AuthContext)
    const { compactView } = useContext(SettingsContext)
    const toast = useToast()

    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    // Edit Mode State
    const [editingTaskId, setEditingTaskId] = useState(null)

    // Form State
    const [taskTitle, setTaskTitle] = useState('')
    const [taskDesc, setTaskDesc] = useState('')
    const [taskPriority, setTaskPriority] = useState('Low')
    const [taskDueDate, setTaskDueDate] = useState('')
    const [selectedColor, setSelectedColor] = useState('#bbf7d0')
    const [recurrenceEnabled, setRecurrenceEnabled] = useState(false)
    const [recurrenceType, setRecurrenceType] = useState('weekly')
    const [recurrenceDays, setRecurrenceDays] = useState(['Mon', 'Wed', 'Fri'])
    const [selectedTags, setSelectedTags] = useState([])

    const colors = [
        { value: '#bbf7d0', label: 'Green', border: '#4ade80' },
        { value: '#e9d5ff', label: 'Purple', border: '#a855f7' },
        { value: '#ffedd5', label: 'Orange', border: '#f97316' },
        { value: '#e0f2fe', label: 'Sky', border: '#0ea5e9' },
        { value: '#fef08a', label: 'Yellow', border: '#eab308' },
        { value: '#fbcfe8', label: 'Pink', border: '#ec4899' },
        { value: '#ef4444', label: 'Red', border: '#b91c1c' },
        { value: '#94a3b8', label: 'Gray', border: '#64748b' },
    ];

    const availableTags = ['Work', 'Study', 'Personal', 'Fitness', 'Daily'];
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    useEffect(() => {
        fetchTasks()
    }, [])

    // Auto-set date when switching to Today view
    useEffect(() => {
        if (view === 'today') {
            setTaskDueDate(new Date().toLocaleDateString('en-CA'))
        } else {
            setTaskDueDate('')
        }
    }, [view])

    const fetchTasks = async () => {
        try {
            const res = await API.get('/tasks')
            setTasks(res.data.tasks || [])
        } catch (err) {
            console.error(err)
            toast.error('Failed to load tasks')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setEditingTaskId(null)
        setTaskTitle('')
        setTaskDesc('')
        setTaskPriority('Low')
        setTaskPriority('Low')
        setTaskDueDate(view === 'today' ? new Date().toLocaleDateString('en-CA') : '')
        setSelectedColor('#bbf7d0')
        setRecurrenceEnabled(false)
        setRecurrenceDays([])
        setSelectedTags([])
    }

    const handleEditClick = (task) => {
        setEditingTaskId(task._id)
        setTaskTitle(task.title)
        setTaskDesc(task.description || '')
        setTaskPriority(task.priority || 'Low')
        setTaskDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '')
        setSelectedColor(task.color || '#bbf7d0')
        setRecurrenceEnabled(task.recurrence && task.recurrence !== 'none')
        setRecurrenceType(task.recurrence !== 'none' ? task.recurrence : 'weekly')
        setRecurrenceDays(task.recurrenceDays || [])
        setSelectedTags(task.tags || [])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!taskTitle.trim()) return

        const payload = {
            title: taskTitle,
            description: taskDesc,
            priority: taskPriority,
            dueDate: taskDueDate,
            color: selectedColor,
            recurrence: recurrenceEnabled ? recurrenceType : 'none',
            recurrenceDays: recurrenceEnabled ? recurrenceDays : [],
            tags: selectedTags
        }

        try {
            if (editingTaskId) {
                // Update
                const res = await API.put(`/tasks/${editingTaskId}`, payload)
                setTasks(tasks.map(t => t._id === editingTaskId ? res.data.task : t))
                toast.success('Task updated successfully')
            } else {
                // Create
                const res = await API.post('/tasks', payload)
                setTasks([res.data.task, ...tasks])
                toast.success('Task added successfully')
            }
            resetForm()
        } catch (err) {
            console.error(err)
            toast.error(editingTaskId ? 'Failed to update task' : 'Failed to create task')
        }
    }

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return
        try {
            await API.delete(`/tasks/${id}`)
            setTasks(tasks.filter(t => t._id !== id))
            if (editingTaskId === id) resetForm()
            toast.success('Task deleted')
        } catch (err) {
            console.error(err)
            toast.error('Failed to delete task')
        }
    }

    const toggleTaskStatus = async (task) => {
        try {
            const updatedTask = { ...task, completed: !task.completed }
            await API.put(`/tasks/${task._id}`, updatedTask)
            setTasks(tasks.map(t => t._id === task._id ? updatedTask : t))
        } catch (err) {
            console.error(err)
            toast.error('Failed to update task')
        }
    }

    const toggleDay = (day) => {
        setRecurrenceDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        )
    }

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        )
    }

    // View Logic
    const displayedTasks = view === 'today'
        ? tasks.filter(t => {
            if (!t.dueDate) return false;
            // Use en-CA for YYYY-MM-DD format
            const today = new Date().toLocaleDateString('en-CA');
            const taskDate = t.dueDate.split('T')[0];
            return taskDate === today;
        })
        : tasks;

    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        pending: tasks.filter(t => !t.completed).length
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-2rem)] p-4 overflow-hidden">
            {/* Left Column: Calendar & Filters */}
            <div className="md:col-span-3 space-y-6 animate-fade-in hidden md:block">
                <Calendar />

                {view === 'overview' && (
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-2xl text-center">
                            <span className="block text-2xl font-bold text-blue-600">{stats.pending}</span>
                            <span className="text-xs text-gray-500 font-semibold">Pending</span>
                        </div>
                        <div className="bg-green-50 p-4 rounded-2xl text-center">
                            <span className="block text-2xl font-bold text-green-600">{stats.completed}</span>
                            <span className="text-xs text-gray-500 font-semibold">Done</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Middle Column: Form */}
            <div className="md:col-span-6 animate-slide-up h-full overflow-y-auto custom-scrollbar pr-2" style={{ animationDelay: '0.1s' }}>
                <div className="bg-white rounded-[2rem] p-8 shadow-card border border-gray-100 min-h-full flex flex-col relative">

                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-extrabold text-gray-900">{editingTaskId ? 'Edit Task' : 'New Task'}</h2>
                            {editingTaskId && (
                                <button onClick={resetForm} className="text-sm text-red-500 hover:text-red-700 font-semibold bg-red-50 px-3 py-1 rounded-full">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 flex-1 pb-20">
                        {/* Title & Desc */}
                        <div className="space-y-6">
                            <input
                                type="text"
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                placeholder="Name your task"
                                className="w-full text-xl font-bold text-gray-800 border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-300"
                            />
                            <input
                                type="text"
                                value={taskDesc}
                                onChange={(e) => setTaskDesc(e.target.value)}
                                placeholder="Describe your task"
                                className="w-full text-base text-gray-600 border-b border-gray-200 py-3 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-300"
                            />
                        </div>

                        {/* Priority & Due Date */}
                        <div className="flex flex-wrap gap-6">
                            <div className="flex-1 min-w-[150px]">
                                <label className="text-sm font-bold text-gray-700 block mb-2">Priority</label>
                                <div className="flex bg-gray-100 rounded-xl p-1">
                                    {['Low', 'Medium', 'High'].map(p => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setTaskPriority(p)}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${taskPriority === p ?
                                                (p === 'High' ? 'bg-red-500 text-white shadow-md' : p === 'Medium' ? 'bg-orange-400 text-white shadow-md' : 'bg-green-500 text-white shadow-md')
                                                : 'text-gray-500 hover:text-gray-800'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <label className="text-sm font-bold text-gray-700 block mb-2">Due Date</label>
                                <input
                                    type="date"
                                    value={taskDueDate}
                                    onChange={(e) => setTaskDueDate(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                />
                            </div>
                        </div>

                        {/* Color */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 mb-3">Color</h3>
                            <div className="flex flex-wrap gap-3">
                                {colors.map((c) => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => setSelectedColor(c.value)}
                                        className={`w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-1 
                                            ${selectedColor === c.value ? 'ring-gray-400 scale-110' : 'ring-transparent'}`}
                                        style={{ backgroundColor: c.value }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Recurrence */}
                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-gray-800">Repeat</h3>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={recurrenceEnabled} onChange={() => setRecurrenceEnabled(!recurrenceEnabled)} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </label>
                            </div>

                            {recurrenceEnabled && (
                                <div className="space-y-4">
                                    <div className="flex bg-white p-1 rounded-xl border border-gray-200 w-full">
                                        {['Daily', 'Weekly', 'Monthly'].map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setRecurrenceType(type.toLowerCase())}
                                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${recurrenceType === type.toLowerCase() ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>

                                    {recurrenceType === 'weekly' && (
                                        <div className="flex justify-between">
                                            {weekDays.map(day => (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    onClick={() => toggleDay(day)}
                                                    className={`w-8 h-8 rounded-full text-[10px] font-bold flex items-center justify-center transition-all
                                                        ${recurrenceDays.includes(day) ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-400'}`}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 mb-3">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {availableTags.map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all
                                            ${selectedTags.includes(tag)
                                                ? 'bg-black text-white border-black'
                                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </form>

                    {/* FAB */}
                    <button
                        onClick={handleSubmit}
                        className={`absolute bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all z-10 
                            ${editingTaskId ? 'bg-blue-600' : 'bg-black'}`}
                    >
                        {editingTaskId ? (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Right Column: List */}
            <div className="md:col-span-3 animate-slide-up h-full overflow-hidden flex flex-col" style={{ animationDelay: '0.2s' }}>
                <div className="flex justify-between items-center mb-6 pl-2">
                    <h2 className="text-2xl font-bold text-gray-800">{view === 'today' ? 'Today' : 'Tasks'}</h2>
                    <div className="flex gap-2">
                        {/* Add filter or sort icons here if needed */}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 pb-20">
                    {displayedTasks.length === 0 ? (
                        <div className="text-center py-10 opacity-50">
                            <p className="text-gray-400">No tasks found</p>
                        </div>
                    ) : (
                        displayedTasks.map(task => (
                            <div key={task._id} className="relative bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                                <div className="absolute top-4 right-4 w-3 h-3 rounded-full" style={{ backgroundColor: task.color || '#bbf7d0' }}></div>

                                <div className="pr-6">
                                    <h4 className={`font-bold text-gray-800 mb-1 ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</h4>
                                    {task.description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{task.description}</p>}

                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {task.priority && (
                                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold text-white
                                                ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-orange-400' : 'bg-green-500'}`}>
                                                {task.priority}
                                            </span>
                                        )}
                                        {task.dueDate && (
                                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 font-medium">
                                                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-2 border-t border-gray-50 pt-3">
                                    <div className="flex gap-1">
                                        {task.tags?.slice(0, 2).map((tag, i) => (
                                            <span key={i} className="text-[10px] text-gray-400">#{tag}</span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditClick(task)} className="p-1.5 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        </button>
                                        <button onClick={() => handleDeleteTask(task._id)} className="p-1.5 rounded-full bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
