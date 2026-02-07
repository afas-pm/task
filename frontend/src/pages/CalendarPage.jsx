import React from 'react'
import Calendar from '../components/Calendar'

const CalendarPage = () => {
    return (
        <div className="p-8 h-full animate-fade-in flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Calendar</h1>
            <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-start justify-center">
                <div className="scale-125 origin-top mt-10">
                    <Calendar />
                </div>
            </div>
        </div>
    )
}

export default CalendarPage
