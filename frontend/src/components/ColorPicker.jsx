import React from 'react';

const colors = [
    { name: 'red', value: '#EF4444' },
    { name: 'orange', value: '#F97316' },
    { name: 'amber', value: '#F59E0B' },
    { name: 'yellow', value: '#EAB308' },
    { name: 'lime', value: '#84CC16' },
    { name: 'green', value: '#22C55E' },
    { name: 'emerald', value: '#10B981' },
    { name: 'teal', value: '#14B8A6' },
    { name: 'cyan', value: '#06B6D4' },
    { name: 'sky', value: '#0EA5E9' },
    { name: 'blue', value: '#3B82F6' },
    { name: 'indigo', value: '#6366F1' },
    { name: 'violet', value: '#8B5CF6' },
    { name: 'purple', value: '#A855F7' },
    { name: 'fuchsia', value: '#D946EF' },
    { name: 'pink', value: '#EC4899' },
    { name: 'rose', value: '#F43F5E' },
];

const ColorPicker = ({ selectedColor, onSelect }) => {
    return (
        <div className="flex flex-wrap gap-2 mt-4">
            {colors.map((color) => (
                <button
                    key={color.name}
                    type="button"
                    onClick={() => onSelect(color.value)}
                    className={`w-6 h-6 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300
                        ${selectedColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                    style={{ backgroundColor: color.value }}
                    aria-label={`Select ${color.name}`}
                />
            ))}
        </div>
    );
};

export default ColorPicker;
