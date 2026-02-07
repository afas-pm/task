import React, { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [compactView, setCompactView] = useState(() => JSON.parse(localStorage.getItem('compactView')) || false);
    const [emailNotifs, setEmailNotifs] = useState(() => JSON.parse(localStorage.getItem('emailNotifs')) || true);
    const [taskReminders, setTaskReminders] = useState(() => JSON.parse(localStorage.getItem('taskReminders')) || true);

    useEffect(() => {
        localStorage.setItem('compactView', JSON.stringify(compactView));
    }, [compactView]);

    useEffect(() => {
        localStorage.setItem('emailNotifs', JSON.stringify(emailNotifs));
    }, [emailNotifs]);

    useEffect(() => {
        localStorage.setItem('taskReminders', JSON.stringify(taskReminders));
    }, [taskReminders]);

    const toggleCompactView = () => setCompactView(prev => !prev);
    const toggleEmailNotifs = () => setEmailNotifs(prev => !prev);
    const toggleTaskReminders = () => setTaskReminders(prev => !prev);

    return (
        <SettingsContext.Provider value={{
            compactView, toggleCompactView,
            emailNotifs, toggleEmailNotifs,
            taskReminders, toggleTaskReminders
        }}>
            {children}
        </SettingsContext.Provider>
    );
};
