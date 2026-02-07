import React, { useState } from 'react';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const generateCalendarDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);

        // Padding
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`pad-${i}`} className="text-center py-2"></div>);
        }

        // Days
        for (let i = 1; i <= totalDays; i++) {
            const isToday = new Date().getDate() === i && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
            days.push(
                <div key={i} className="flex justify-center items-center py-1">
                    <button className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all
                        ${isToday
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 font-bold'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600'
                        }`}>
                        {i}
                    </button>
                </div>
            );
        }
        return days;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative">
            {/* Decorative Background Blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-bl-[4rem] -z-0"></div>

            <div className="flex justify-between items-center mb-6 relative z-10 px-1">
                <h3 className="text-xl font-extrabold text-gray-800 dark:text-white tracking-tight">
                    {monthNames[currentDate.getMonth()]} <span className="text-blue-500 font-normal">{currentDate.getFullYear()}</span>
                </h3>
                <div className="flex gap-1 bg-gray-50 dark:bg-gray-700 p-1 rounded-full">
                    <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-600 rounded-full shadow-sm text-gray-500 dark:text-gray-300 hover:text-blue-600 hover:shadow-md transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-600 rounded-full shadow-sm text-gray-500 dark:text-gray-300 hover:text-blue-600 hover:shadow-md transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 mb-3 relative z-10">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <div key={`${day}-${index}`} className="text-center text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-2">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1 relative z-10">
                {generateCalendarDays()}
            </div>
        </div>
    );
};

export default Calendar;
