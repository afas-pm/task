import React, { useState } from 'react'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto h-screen relative w-full transition-all">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <span className="text-xl font-bold text-gray-800">TaskFlow</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 shadow-sm"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                </div>

                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default Layout
