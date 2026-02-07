import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ThemeContext } from '../context/ThemeContext'

const Settings = () => {
    const { user, logout } = useContext(AuthContext)
    const { darkMode, toggleTheme } = useContext(ThemeContext)

    // Other settings (mock persistence for now, or expand contexts later)
    const [compactView, setCompactView] = useState(() => JSON.parse(localStorage.getItem('compactView')) || false)
    const [emailNotifs, setEmailNotifs] = useState(() => JSON.parse(localStorage.getItem('emailNotifs')) || true)
    const [taskReminders, setTaskReminders] = useState(() => JSON.parse(localStorage.getItem('taskReminders')) || true)

    useEffect(() => {
        localStorage.setItem('compactView', JSON.stringify(compactView))
    }, [compactView])

    useEffect(() => {
        localStorage.setItem('emailNotifs', JSON.stringify(emailNotifs))
    }, [emailNotifs])

    useEffect(() => {
        localStorage.setItem('taskReminders', JSON.stringify(taskReminders))
    }, [taskReminders])

    return (
        <div className="p-8 max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 dark:text-white">Settings</h1>

            {/* Profile Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex items-center gap-6 dark:bg-gray-800 dark:border-gray-700">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-4xl text-white font-bold shadow-lg">
                    {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user?.name || 'User'}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                    <button onClick={logout} className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 dark:text-white">Appearance</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-300">Dark Mode</span>
                            <div
                                onClick={toggleTheme}
                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${darkMode ? 'left-7' : 'left-1'}`}></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-300">Compact View</span>
                            <div
                                onClick={() => setCompactView(!compactView)}
                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${compactView ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${compactView ? 'left-7' : 'left-1'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 dark:text-white">Notifications</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-300">Email Notifications</span>
                            <div
                                onClick={() => setEmailNotifs(!emailNotifs)}
                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${emailNotifs ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${emailNotifs ? 'left-7' : 'left-1'}`}></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-300">Task Reminders</span>
                            <div
                                onClick={() => setTaskReminders(!taskReminders)}
                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${taskReminders ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${taskReminders ? 'left-7' : 'left-1'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
