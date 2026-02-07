import React from 'react'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default Layout
