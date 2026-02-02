import React, { createContext, useState, useContext, useCallback } from 'react'

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => {
            removeToast(id)
        }, 3000)
    }, [])

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    // Helper functions to match old API roughly
    const toast = {
        success: (msg) => addToast(msg, 'success'),
        error: (msg) => addToast(msg, 'error'),
        info: (msg) => addToast(msg, 'info')
    }

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`px-4 py-3 rounded shadow-lg text-white font-medium min-w-[250px] animate-fade-in-down transition-all transform hover:scale-105 ${t.type === 'success' ? 'bg-green-600' :
                                t.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
                            }`}
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}
